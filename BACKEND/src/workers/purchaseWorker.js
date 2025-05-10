const { Worker } = require("bullmq");
const db = require("../models/index");
const { sequelize } = db;
const Item = db.Item;
const User = db.User;
const Coin = db.Coin;
const Transaction = db.Transaction;
const { redis } = require("../config/configRedis");
const Redis = require("ioredis");
const { generateCode } = require("../utils/generateCode");
const { getCache, setCache, deleteCache } = require("../utils/cache");
require("dotenv").config();

const publisher = new Redis(redis);

const worker = new Worker(
  "purchase",
  async (job) => {
    const { receiver_information_id, user_id, item_id, quantity, name } =
      job.data;

    if (!user_id || !item_id || !quantity || quantity <= 0) {
      throw new Error(
        "Invalid job data: missing or invalid user_id, item_id, or quantity"
      );
    }

    try {
      return await sequelize.transaction(async (t) => {
        const cacheKeyItem = `item:${item_id}`;
        let itemData = await getCache(cacheKeyItem);

        let item;
        if (itemData) {
          item = Item.build(itemData, { isNewRecord: false });
          item.creator =
            item.creator || (await item.getCreator({ transaction: t }));
        } else {
          item = await Item.findByPk(item_id, {
            include: [
              {
                model: User,
                as: "creator",
                attributes: ["id", "full_name", "username"],
              },
            ],
            transaction: t,
            lock: true,
          });
          if (!item) throw new Error("Item not found");
          await setCache(cacheKeyItem, item.toJSON(), 300);
        }

        if (item.status !== "available" || item.stock < quantity) {
          throw new Error("Item not available or insufficient stock");
        }

        const cacheKeyUser = `user:${user_id}`;
        let userData = await getCache(cacheKeyUser);

        let user;
        if (userData) {
          user = User.build(userData, { isNewRecord: false });
          user.coins = await Coin.findOne({
            where: { user_id },
            transaction: t,
            lock: true,
          });
        } else {
          user = await User.findByPk(user_id, {
            include: [
              {
                model: Coin,
                as: "coins",
                attributes: ["id", "amount"],
              },
            ],
            transaction: t,
            lock: true,
          });
          if (!user) throw new Error("User not found");
          await setCache(cacheKeyUser, user.toJSON(), 300);
        }

        if (!user.coins || user.coins.amount < item.price * quantity) {
          throw new Error("Insufficient balance");
        }

        await user.coins.update(
          { amount: user.coins.amount - item.price * quantity },
          { transaction: t }
        );

        const newStock = item.stock - quantity;
        await item.update(
          {
            stock: newStock,
            status: newStock === 0 ? "sold_out" : "available",
          },
          { transaction: t }
        );

        await deleteCache(cacheKeyItem);
        await deleteCache(cacheKeyUser);
        await deleteCache("items:all");
        await deleteCache(`items:user:${item.creator.id}`);
        await deleteCache(`item:public_id:${item.public_id}`);

        await publisher.publish(
          "stock-update",
          JSON.stringify({
            itemId: item_id,
            newStock: newStock,
            name: item.name,
            price: item.price,
            status: item.status,
          })
        );

        let uniqueCode, exists;
        do {
          uniqueCode = generateCode();
          exists = await Transaction.findOne({
            where: { public_id: uniqueCode },
            transaction: t,
          });
        } while (exists !== null);

        const itemSnapshot = {
          public_id: item.public_id,
          creator: item.creator.dataValues,
          name: item.name,
          description: item.description,
          price: item.price,
        };
        const transaction = await Transaction.create(
          {
            public_id: uniqueCode,
            receiver_information_id,
            buyer_id: user.id,
            seller_id: item.creator.dataValues.id,
            item_id: item.id,
            name,
            item_snapshot: itemSnapshot,
            total_price: item.price * quantity,
            quantity,
            status: "pending",
          },
          { transaction: t }
        );

        await setCache(
          `transaction:id:${transaction.id}`,
          transaction.toJSON(),
          300
        );

        const buyerCacheKey = `buyer:transaction:id:${user.id}`;
        let buyerTransactionIds = await getCache(buyerCacheKey);
        if (!buyerTransactionIds || !Array.isArray(buyerTransactionIds)) {
          console.warn(
            `Invalid or missing buyer cache for ${buyerCacheKey}, initializing as []`
          );
          buyerTransactionIds = [];
        }
        if (!buyerTransactionIds.includes(transaction.id)) {
          buyerTransactionIds.push(transaction.id);
          await setCache(buyerCacheKey, buyerTransactionIds, 300);
          console.log(
            `Updated buyer cache ${buyerCacheKey}:`,
            buyerTransactionIds
          );
        }

        const sellerCacheKey = `seller:transaction:id:${item.creator.dataValues.id}`;
        let sellerTransactionIds = await getCache(sellerCacheKey);
        if (!sellerTransactionIds || !Array.isArray(sellerTransactionIds)) {
          console.warn(
            `Invalid or missing seller cache for ${sellerCacheKey}, initializing as []`
          );
          sellerTransactionIds = [];
        }
        if (!sellerTransactionIds.includes(transaction.id)) {
          sellerTransactionIds.push(transaction.id);
          await setCache(sellerCacheKey, sellerTransactionIds, 300);
          console.log(
            `Updated seller cache ${sellerCacheKey}:`,
            sellerTransactionIds
          );
        }

        return transaction;
      });
    } catch (error) {
      console.error(`Job ${job.id} failed with error:`, error);
      throw error;
    }
  },
  { connection: redis }
);

worker.on("completed", (job) => {
  console.log(`✅ Job completed: ${job.id}`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job.id} failed: ${err.message}`);
});
