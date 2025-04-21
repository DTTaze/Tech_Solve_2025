const db = require("../models/index");
const Item = db.Item;
const User = db.User;
const Coin = db.Coin;
const Transaction = db.Transaction;
const { generateCode } = require("../utils/generateCode");
const purchaseQueue = require("./queue");
const { uploadImages } = require("../services/imageService");
const { sequelize } = require("sequelize");
const Image = db.Image;

const createItem = async (itemData, user_id, images) => {
  try {
    // Validate required fields
    if (!user_id || !itemData.name || !itemData.price || !itemData.stock) {
      throw new Error("Missing required fields (owner_id, name, price, stock)");
    }

    // Validate price
    if (itemData.price < 1) {
      throw new Error("Price must be at least 1");
    }

    // Validate stock
    if (itemData.stock < 0) {
      throw new Error("Stock cannot be negative");
    }

    // Check if owner exists
    const owner = await User.findByPk(user_id);
    if (!owner) {
      throw new Error("Owner ID does not exist");
    }

    // Create item with transaction
    const result = await sequelize.transaction(async (t) => {
      const newItem = await Item.create({
        name: itemData.name,
        price: itemData.price,
        stock: itemData.stock,
        description: itemData.description,
        status: itemData.status,
        owner_id: user_id
      }, { transaction: t });

    if (images && images.length > 0) {
      const uploadedImages = await uploadImages(images, newItem.id, "item");
      if (uploadedImages.length === 0) {
        throw new Error("Failed to upload images");
      }
    }

      return newItem;
    });

    return result;
  } catch (error) {
    // Log error for debugging
    console.error('Error creating item:', error);
    throw error;
  }
};

const getAllItems = async () => {
  try {
    const items = await Item.findAll();
    
    // Get all item IDs
    const itemIds = items.map(item => item.id);
    
    // Find all images for these items
    const images = await Image.findAll({
      where: {
        reference_id: itemIds,
        type: 'item'
      }
    });
    
    // Group images by item_id
    const imagesByItemId = images.reduce((acc, image) => {
      if (!acc[image.reference_id]) {
        acc[image.reference_id] = [];
      }
      acc[image.reference_id].push(image.url);
      return acc;
    }, {});
    
    // Add images to each item
    return items.map(item => ({
      ...item.toJSON(),
      images: imagesByItemId[item.id] || []
    }));
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
    const images = await Image.findAll({
      where: {
        reference_id: item_id,
        type: 'item'
      }
    });
    
    if (!item) {
      throw new Error("Item not found");
    }

    return {
      ...item.toJSON(),
      images: images.map(image => image.url)
    };
  } catch (e) {
    throw e;
  }
};

const getItemByIdUser = async (user_id) => {
  try {
    if (!user_id) {
      throw new Error("User ID is required");
    }

    const items = await Item.findAll({ where: { owner_id: user_id } });
    const itemIds = items.map(item => item.id);
    const images = await Image.findAll({
      where: {
        reference_id: itemIds,
        type: 'item'
      }
    });

    return items.map(item => ({
      ...item.toJSON(),
      images: images.filter(image => image.reference_id === item.id).map(image => image.url)
    }));
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
