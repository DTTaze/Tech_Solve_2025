const { Worker } = require("bullmq");
const redis = require("../config/configRedis");
const db = require("../models/index");
const Item = db.Item;
const User = db.User;
const Transaction = db.Transaction;
const Inventory = db.Inventory;
const { generateCode } = require("../utils/generateCode");
const { emitStockUpdate } = require("./socketService");
const Redis = require("ioredis");
const publisher = new Redis(process.env.URL_REDIS);
require("dotenv").config();

const worker = new Worker(
  "purchase",
  async (job) => {
    const { user_id, item_id, quantity, name } = job.data;

    const item = await Item.findByPk(item_id, {
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "full_name", "username"],
        },
      ],
    });
    console.log("check item", item);
    if (!item || item.status !== "available" || item.stock < quantity) {
      throw new Error("Item not available or insufficient stock");
    }

    const user = await User.findByPk(user_id);
    if (!user || user.coins < item.price * quantity) {
      throw new Error("User not found or insufficient balance");
    }

    await user.update({ coins: user.coins - item.price * quantity });
    const newStock = item.stock - quantity;
    await item.update({
      stock: newStock,
      status: newStock === 0 ? "sold_out" : "available",
    });

    console.log("Publishing stock update event");
    await publisher.publish(
      "stock-update",
      JSON.stringify({
        itemId: item_id,
        newStock: newStock,
        name: item.name,
        price: item.price,
        status: newStock === 0 ? "sold_out" : "available",
      })
    );

    let uniqueCode, exists;
    do {
      uniqueCode = generateCode();
      exists = await Transaction.findOne({ where: { public_id: uniqueCode } });
    } while (exists !== null);

    const itemSnapshot = {
      public_id: item.public_id,
      creator: item.creator.dataValues,
      name: item.name,
      description: item.description,
      price: item.price,
    };

    const transaction = await Transaction.create({
      public_id: uniqueCode,
      name,
      buyer_id: user.id,
      item_id: item.id,
      item_snapshot: itemSnapshot,
      quantity,
      total_price: item.price * quantity,
      status: "completed",
    });
    return transaction;
  },
  { connection: redis }
);

worker.on("completed", (job) => {
  console.log(`✅ Job completed: ${job.id}`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job.id} failed: ${err.message}`);
});
