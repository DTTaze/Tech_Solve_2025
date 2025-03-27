const db = require("../models/index");
const Item = db.Item;
const User = db.User;

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

const updateItem = async (id, itemData) => {
  try {
    const item = await Item.findByPk(id);
    if (!item) {
      throw new Error("Item not found");
    }

    if (itemData.name !== undefined && itemData.name.trim() === "") {
      throw new Error("Name cannot be empty");
    }

    if (itemData.price !== undefined && itemData.price < 1) {
      throw new Error("Price must be at least 1");
    }

    await item.update(itemData);
    return item;
  } catch (e) {
    console.e("Update failed:", e);
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

module.exports = {
  createItem,
  getAllItems,
  getItemByIdItem,
  getItemByIdUser,
  updateItem,
  deleteItem,
};
