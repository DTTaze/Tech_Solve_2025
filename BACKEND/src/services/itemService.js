const db = require("../models/index");
const Item = db.Item;
const User = db.User;
const Coin = db.Coin;
const Transaction = db.Transaction;
import { where } from "sequelize";
import { generateCode } from "../utils/generateCode";

const createItem = async (itemData, user_id) => {
  try {
    if (!user_id || !itemData.name || !itemData.price) {
      throw new Error("Missing required fields (owner_id, name, price)");
    }

    if (itemData.price < 1) {
      throw new Error("Price must be at least 1");
    }

    const owner = await User.findByPk(user_id);
    if (!owner) {
      throw new Error("Owner ID does not exist");
    }

    const newItemData = { ...itemData, owner_id: user_id };
    const newItem = await Item.create(newItemData);
    return newItem;
  } catch (e) {
    throw e;
  }
};

const getAllItems = async () => {
  try {
    return await Item.findAll();
  } catch (e) {
    throw e;
  }
};

const getItemByIdItem = async (item_id) => {
  try {
    if (!item_id) {
      throw new Error("Item ID is required");
    }

    const item = await Item.findByPk(item_id);
    if (!item) {
      throw new Error("Item not found");
    }

    return item;
  } catch (e) {
    throw e;
  }
};

const getItemByIdUser = async (user_id) => {
  try {
    if (!user_id) {
      throw new Error("User ID is required");
    }

    return await Item.findAll({ where: { owner_id: user_id } });
  } catch (e) {
    throw e;
  }
};

const updateItem = async (id, data) => {
  try {
    let { owner_id, name, price, stock, description, status } = data;
    let item = await Item.findByPk(id);
    if (!item) {
      throw new Error("Item not found");
    }
    owner_id ? (item.owner_id = owner_id) : (item.owner_id = item.owner_id);
    name ? (item.name = name) : (item.name = item.name);
    status ? (item.status = status) : (item.status = item.status);
    description
      ? (item.description = description)
      : (item.description = item.description);
    price ? (item.price = price) : (item.price = item.price);

    if (stock !== undefined) {
      if (stock < 0) {
        throw new Error("Stock cannot be negative");
      }
      item.stock = stock;
      item.status = stock > 0 ? "available" : "sold";
    }
    await item.save();
    return item;
  } catch (e) {
    throw e;
  }
};

const deleteItem = async (item_id) => {
  try {
    if (!item_id) {
      throw new Error("Item ID is required");
    }

    const item = await Item.findByPk(item_id);
    if (!item) {
      throw new Error("Item not found");
    }

    await item.destroy();
    return { message: "Item deleted successfully" };
  } catch (e) {
    throw e;
  }
};

const purchaseItem = async (user_id, user_coin_id, item_id, data) => {
  try {
    let {name, quantity } = data;

    if (quantity === undefined) {
      quantity = 1;
    } else {
      if (quantity < 1) {
        throw new Error("Quantity must be positive");
      } else {
        quantity = Number(quantity);
      }
    }

    if (!user_id || !item_id || quantity < 1) {
      throw new Error("User ID, Item ID, and valid quantity are required");
    }

    const item = await Item.findByPk(item_id);
    if (!item) {
      throw new Error("Item not found");
    }

    if (item.status !== "available") {
      throw new Error("Item is not available for purchase");
    }

    if (item.stock < quantity) {
      throw new Error("Not enough stock available");
    }

    const user_coins = await Coin.findByPk(user_coin_id);
    if (!user_coins) {
      throw new Error("User coins not found");
    }

    const totalPrice = item.price * quantity;
    if (user_coins.amount < totalPrice) {
      throw new Error("Insufficient balance");
    }

    await user_coins.update({ amount: user_coins.amount - totalPrice });

    await item.update({
      stock: item.stock - quantity,
      status: item.stock - quantity === 0 ? "sold" : "available",
    });

    let isTransactionIdExisted;
    let uniqueCode;
    do {
      uniqueCode = generateCode();
      isTransactionIdExisted = await Transaction.findByPk(uniqueCode);
    } while (isTransactionIdExisted !== null);

    const transaction = await Transaction.create({
      id: uniqueCode,
      name: name,
      buyer_id: user_id,
      item_id: item.id,
      quantity: quantity,
      total_price: totalPrice,
      status: "pending",
    });

    return { message: "Purchase successful", item, transaction };
  } catch (e) {
    throw e;
  }
};


module.exports = {
  createItem,
  getAllItems,
  getItemByIdItem,
  getItemByIdUser,
  updateItem,
  deleteItem,
  purchaseItem,
};
