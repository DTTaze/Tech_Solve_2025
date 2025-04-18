const db = require("../models/index.js");
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

    return transaction;
  } catch (error) {
    throw error;
  }
};

const getTransactionByUserId = async (buyerId) => {
  try {
    const transaction = await Transaction.findAll({
      where: { buyer_id: buyerId },
    });
    if (!transaction) {
      throw new Error("Transaction not found.");
    }
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
        {
          model: Item,
          as: "item",
          attributes: ["id", "name"],
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
