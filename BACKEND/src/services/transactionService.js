const db = require("../models/index.js");
const { redisClient } = require("../config/configRedis.js");

const Transaction = db.Transaction;
const Item = db.Item;
const User = db.User;

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

const getTransactionByUserId = async (buyer_id) => {
  try {
    const listBuyerTransactioncacheId = await redisClient.get(`buyer:transaction:id:${buyer_id}`);
    if (listBuyerTransactioncacheId) {
      console.log("listBuyerTransactioncacheId", listBuyerTransactioncacheId);
      const listTransactionId = JSON.parse(listBuyerTransactioncacheId);
      let result = [];
      for (const transactionId of listTransactionId) {
        const transactioncache = await redisClient.get(`transaction:id:${transactionId}`);
        if (transactioncache) {
          const transactionData = JSON.parse(transactioncache);
          result.push(transactionData);
        }else {
          const transaction = await Transaction.findOne({where: { id: transactionId },});
          if (transaction) {
            result.push(transaction);
            // Add transaction to Redis
            await redisClient.set(`transaction:id:${transaction.id}`, JSON.stringify(transaction), 'EX', 3600);
          }
          else {
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
      ],
    });
    if (!transaction) {
      throw new Error("Transaction not found.");
    }
    // Add transaction to Redis
    const transactionIds = transaction.map((item) => item.id);
    await redisClient.set(
      `buyer:transaction:id:${buyerId}`,
      JSON.stringify(transactionIds),
      "EX",
      3600 // Set expiration time to 1 hour
    );
    return transaction;
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

const deleteTransaction = async (transaction_id) => {
  try {
    const transaction = await Transaction.destroy({
      where: { id: transaction_id },
    });
    if (!transaction) {
      throw new Error("Transaction not found.");
    }
    return "Transaction deleted successfully.";
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createTransaction,
  getTransactionByUserId,
  deleteTransaction,
  getAllTransactions,
};
