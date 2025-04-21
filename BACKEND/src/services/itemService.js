const { nanoid } = require("nanoid");
const db = require("../models/index");
const Item = db.Item;
const User = db.User;
const purchaseQueue = require("./queue");

const createItem = async (itemData, user_id) => {
  try {
    let { name, price, description, status, stock } = itemData;
    if (!user_id || !name || !price) {
      throw new Error("Missing required fields (owner_id, name, price)");
    }

    if (price < 1) {
      throw new Error("Price must be at least 1");
    }
    if (stock === undefined || stock < 1) {
      throw new Error("Stock must be at least 1");
    }

    const owner = await User.findByPk(user_id);
    if (!owner) {
      throw new Error("Owner ID does not exist");
    }

    const newItem = await Item.create({
      public_id: nanoid(),
      owner_id: user_id,
      name,
      price,
      description,
      status,
      stock,
    });
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
    let { name, quantity } = data;
    if (!user_id || !item_id || quantity <= 0) {
      throw new Error("Invalid input data");
    }

    const result = await purchaseQueue.add("purchase", {
      user_id,
      item_id,
      name,
      quantity,
    });
    return { message: "Purchase request is in queue", jobId: result.id };
  } catch (error) {
    throw error;
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
