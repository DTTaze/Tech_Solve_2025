const db = require("../models/index.js");
const { redisClient } = require("../config/configRedis.js");
const { getCache, setCache, deleteCache } = require("../utils/cache");
const Transaction = db.Transaction;
const ReceiverInformation = db.ReceiverInformation;
const Item = db.Item;
const User = db.User;
const { updateIncreaseCoin } = require("./coinService.js");
const { getUserByID } = require("./userService.js");
const { emitStockUpdate } = require("./socketService");

const cacheItemAll = "items:all";
const cacheItemId = (id) => `item:${id}`;
const cacheItemUserId = (id) => `items:user:${id}`;

const createTransaction = async (transactionData) => {
  try {
    const { name, quantity, buyer_id, item_id, status } = transactionData;

    if (!name || !buyer_id || !item_id) {
      throw new Error("Name, buyer_id, and item_id are required fields.");
    }

    const parsedQuantity = Number(quantity);
    const parsedBuyerId = Number(buyer_id);
    const parsedItemId = Number(item_id);

    if (isNaN(parsedBuyerId) || isNaN(parsedItemId)) {
      throw new Error("buyer_id, and item_id must be valid numbers.");
    }

    // Nếu `quantity` không hợp lệ, mặc định là 1
    const finalQuantity =
      isNaN(parsedQuantity) || parsedQuantity <= 0 ? 1 : parsedQuantity;

    // Nếu `status` không hợp lệ, mặc định là "pending"
    const finalStatus = status?.trim() ? status : "pending";

    const item = await Item.findOne({ where: { id: parsedItemId } });
    if (!item) {
      throw new Error("Item not found.");
    }

    if (!item.price || isNaN(item.price)) {
      throw new Error("Invalid item price.");
    }

    const total_price = item.price * finalQuantity;

    const transaction = await Transaction.create({
      name,
      buyer_id: parsedBuyerId,
      item_id: parsedItemId,
      total_price,
      quantity: finalQuantity,
      status: finalStatus,
    });

    // Add transaction to Redis
    const redisKey = `transaction:id:${transaction.id}`;
    await redisClient.set(
      redisKey,
      JSON.stringify(transaction),
      "EX",
      3600 // Set expiration time to 1 hour
    );

    return transaction;
  } catch (error) {
    throw error;
  }
};

const getTransactionByBuyerId = async (buyer_id) => {
  try {
    const listBuyerTransactioncacheId = await redisClient.get(
      `buyer:transaction:id:${buyer_id}`
    );
    if (listBuyerTransactioncacheId) {
      console.log("listBuyerTransactioncacheId", listBuyerTransactioncacheId);
      const listTransactionId = JSON.parse(listBuyerTransactioncacheId);
      let result = [];
      for (const transactionId of listTransactionId) {
        const transactioncache = await redisClient.get(
          `transaction:id:${transactionId}`
        );
        if (transactioncache) {
          const transactionData = JSON.parse(transactioncache);
          result.push(transactionData);
        } else {
          const transaction = await Transaction.findOne({
            where: { id: transactionId },
          });
          if (transaction) {
            result.push(transaction);
            await redisClient.set(
              `transaction:id:${transaction.id}`,
              JSON.stringify(transaction),
              "EX",
              3600
            );
          } else {
            throw new Error("Transaction not found.");
          }
        }
      }
      return result;
    }
    const transaction = await Transaction.findAll({
      where: { buyer_id: buyer_id },
      include: [
        {
          model: User,
          as: "buyer",
          attributes: ["id", "full_name", "username"],
        },
        {
          model: User,
          as: "seller",
          attributes: ["id", "full_name", "username"],
        },
        {
          model: ReceiverInformation,
          as: "receiver_information",
        },
      ],
    });
    if (!transaction) {
      throw new Error("Transaction not found.");
    }
    const transactionIds = transaction.map((item) => item.id);
    await redisClient.set(
      `buyer:transaction:id:${buyer_id}`,
      JSON.stringify(transactionIds),
      "EX",
      3600
    );
    for (const newTransaction of transaction) {
      const transactionData = newTransaction.toJSON();
      await redisClient.set(
        `transaction:id:${newTransaction.id}`,
        JSON.stringify(transactionData),
        "EX",
        3600
      );
    }

    return transaction.map((t) => t.toJSON());
  } catch (error) {
    throw error;
  }
};

const getTransactionBySellerId = async (seller_id) => {
  try {
    const listSellerTransactionCacheId = await redisClient.get(
      `seller:transaction:id:${seller_id}`
    );
    if (listSellerTransactionCacheId) {
      console.log("listSellerTransactionCacheId", listSellerTransactionCacheId);
      const listTransactionId = JSON.parse(listSellerTransactionCacheId);
      let result = [];
      for (const transactionId of listTransactionId) {
        const transactionCache = await redisClient.get(
          `transaction:id:${transactionId}`
        );
        if (transactionCache) {
          const transactionData = JSON.parse(transactionCache);
          result.push(transactionData);
        } else {
          const transaction = await Transaction.findOne({
            where: { id: transactionId },
          });
          if (transaction) {
            result.push(transaction);
            await redisClient.set(
              `transaction:id:${transaction.id}`,
              JSON.stringify(transaction),
              "EX",
              3600
            );
          } else {
            throw new Error("Transaction not found.");
          }
        }
      }
      return result;
    }
    const transaction = await Transaction.findAll({
      where: { seller_id: seller_id },
      include: [
        {
          model: User,
          as: "seller",
          attributes: ["id", "full_name", "username"],
        },
        {
          model: User,
          as: "buyer",
          attributes: ["id", "full_name", "username"],
        },
        {
          model: ReceiverInformation,
          as: "receiver_information",
        },
      ],
    });
    if (!transaction || transaction.length === 0) {
      throw new Error("Transaction not found.");
    }
    const transactionIds = transaction.map((item) => item.id);
    await redisClient.set(
      `seller:transaction:id:${seller_id}`,
      JSON.stringify(transactionIds),
      "EX",
      3600
    );
    for (const newTransaction of transaction) {
      const transactionData = newTransaction.toJSON();
      await redisClient.set(
        `transaction:id:${newTransaction.id}`,
        JSON.stringify(transactionData),
        "EX",
        3600
      );
    }

    return transaction.map((t) => t.toJSON());
  } catch (error) {
    throw error;
  }
};

const getAllTransactions = async () => {
  try {
    return await Transaction.findAll({
      include: [
        {
          model: User,
          as: "buyer",
          attributes: ["id", "full_name", "username"],
        },
      ],
    });
  } catch (e) {
    throw e;
  }
};

const getTransactionById = async (id) => {
  try {
    if (!id) {
      throw new Error("Missing parameters");
    }
    return await Transaction.findByPk(id, {
      include: [
        {
          model: ReceiverInformation,
          as: "receiver_information",
        },
        {
          model: Item,
          as: "item",
        },
      ],
    });
  } catch (e) {
    throw e;
  }
};

const cancelTransactionById = async (id) => {
  if (typeof id !== "number" && typeof id !== "string") {
    throw new Error("Invalid id type");
  }
  if (!id) {
    throw new Error("Missing parameters");
  }

  const t = await Transaction.sequelize.transaction();
  try {
    const transaction = await Transaction.findByPk(id, { transaction: t });
    if (!transaction) {
      throw new Error("Transaction not found");
    }
    if (transaction.status === "cancelled") {
      throw new Error("Transaction is already cancelled");
    }
    if (transaction.status === "accepted") {
      throw new Error("Cannot cancel accepted transaction");
    }
    if (
      !transaction.item_snapshot ||
      typeof transaction.item_snapshot.price !== "number"
    ) {
      throw new Error("Invalid transaction price");
    }

    transaction.status = "cancelled";
    await transaction.save({ transaction: t });
    await deleteCache(`transaction:id:${id}`);

    const data = await getUserByID(transaction.buyer_id);
    if (!data || !data.coins.id) {
      throw new Error("Invalid user or coin_id");
    }
    await updateIncreaseCoin(data.coins.id, transaction.item_snapshot.price, {
      transaction: t,
    });
    const item = await Item.findByPk(transaction.item_id, { transaction: t });
    if (!item) {
      throw new Error("Item not found");
    }

    const originalStock = item.stock;
    const originalStatus = item.status;

    item.stock += transaction.quantity;
    item.status = item.stock > 0 ? "available" : "sold_out";

    if (originalStock !== item.stock || originalStatus !== item.status) {
      emitStockUpdate(item.id, item.stock, {
        name: item.name,
        price: item.price,
        status: item.status,
      });
    }

    await item.save({ transaction: t });

    await deleteCache(cacheItemId(item.id));
    await deleteCache(cacheItemUserId(item.creator_id));
    await deleteCache(cacheItemAll);

    await t.commit();
    return transaction;
  } catch (e) {
    await t.rollback();
    throw e;
  }
};

const deleteTransaction = async (transaction_id) => {
  try {
    if (!transaction_id) {
      throw new Error("Missing parameters");
    }
    const transaction = await Transaction.destroy({
      where: { id: transaction_id },
    });
    if (!transaction) {
      throw new Error("Transaction not found.");
    }
    const buyerCacheKey = `buyer:transaction:id:${transaction.buyer_id}`;
    await deleteCache(buyerCacheKey);

    const sellerCacheKey = `seller:transaction:id:${transaction.seller_id}`;
    await deleteCache(sellerCacheKey);

    return "Transaction deleted successfully.";
  } catch (error) {
    throw error;
  }
};

const getAllTransactionsByStatus = async (status) => {
  try {
    if (!status) {
      throw new Error("Missing parameters");
    }

    const transactions = await Transaction.findAll({
      where: { status },
    });

    if (!transactions || transactions.length === 0) {
      throw new Error("Transaction not found with the specified status");
    }

    return transactions;
  } catch (error) {
    throw error;
  }
};

const makeDecision = async (transaction_id, decision) => {
  if (
    typeof transaction_id !== "number" &&
    typeof transaction_id !== "string"
  ) {
    throw new Error("Invalid transaction_id type");
  }
  if (typeof decision !== "string") {
    throw new Error("Invalid decision type");
  }
  if (!transaction_id || !decision) {
    throw new Error("Missing parameters");
  }
  if (!["accepted", "rejected", "pending"].includes(decision)) {
    throw new Error("Wrong new status to make decision");
  }

  const t = await Transaction.sequelize.transaction();
  try {
    const transaction = await Transaction.findByPk(transaction_id, {
      transaction: t,
    });
    if (!transaction) {
      throw new Error("Transaction not found");
    }
    if (transaction.status === decision) {
      throw new Error("Transaction is already in this status");
    }
    if (transaction.status === "accepted" && decision === "pending") {
      throw new Error("Cannot revert accepted transaction to pending");
    }
    if (
      !transaction.item_snapshot ||
      typeof transaction.item_snapshot.price !== "number"
    ) {
      throw new Error("Invalid transaction price");
    }

    transaction.status = decision;
    await transaction.save({ transaction: t });

    await deleteCache(`transaction:id:${transaction_id}`);
    const item = await Item.findByPk(transaction.dataValues.item_id, {
      transaction: t,
    });

    if (decision === "rejected") {
      const data = await getUserByID(transaction.buyer_id);
      if (!data || !data.coins.id) {
        throw new Error("Invalid user or coin_id");
      }
      await updateIncreaseCoin(data.coins.id, transaction.item_snapshot.price, {
        transaction: t,
      });
      const originalStock = item.stock;
      const originalStatus = item.status;
      item.stock += transaction.dataValues.quantity;
      item.status = item.stock > 0 ? "available" : "sold_out";
      if (originalStock !== item.stock || originalStatus !== item.status) {
        emitStockUpdate(item.id, item.stock, {
          name: item.name,
          price: item.price,
          status: item.status,
        });
      }
      await item.save({ transaction: t });
      await deleteCache(cacheItemId(item.id));
      await deleteCache(cacheItemUserId(item.creator_id));
      await deleteCache(cacheItemAll);
    }

    await t.commit();
    return transaction;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

module.exports = {
  createTransaction,
  getTransactionByBuyerId,
  getTransactionBySellerId,
  deleteTransaction,
  getAllTransactions,
  makeDecision,
  getAllTransactionsByStatus,
  getTransactionById,
  cancelTransactionById,
};
