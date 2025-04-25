const { nanoid } = require("nanoid");
const db = require("../models/index");
const Item = db.Item;
const User = db.User;
const purchaseQueue = require("./queue");
const { uploadImages } = require("../services/imageService");
const { sequelize } = require("../models");
const { where } = require("sequelize");
const Image = db.Image;
const cloudinary = require("cloudinary").v2;

const createItem = async (itemData, user_id, images) => {
  try {
    if (!itemData.name || !itemData.price || !itemData.stock) {
      throw new Error("Missing required fields (name, price, stock)");
    }
    if (itemData.purchase_limit_per_day < 1) {
      throw new Error("Purchase limit per day must be at least 1");
    }
    if (itemData.price < 1) {
      throw new Error("Price must be at least 1");
    }
    const stock = itemData.stock;
    if (stock === undefined || stock < 1) {
      throw new Error("Stock must be at least 1");
    }

    const result = await sequelize.transaction(async (t) => {
      const newItem = await Item.create(
        {
          public_id: nanoid(),
          name: itemData.name,
          price: itemData.price,
          stock: itemData.stock,
          description: itemData.description,
          status: itemData.status,
          owner_id: user_id,
          purchase_limit_per_day: itemData.purchase_limit_per_day,
        },
        { transaction: t }
      );

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
    console.error("Error creating item:", error);
    throw error;
  }
};

const getAllItems = async () => {
  try {
    const items = await Item.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "username"],
        },
      ],
    });
    const itemIds = items.map((item) => item.id);
    const images = await Image.findAll({
      where: {
        reference_id: itemIds,
        reference_type: "item",
      },
    });

    const imagesByItemId = images.reduce((acc, image) => {
      if (!acc[image.reference_id]) {
        acc[image.reference_id] = [];
      }
      acc[image.reference_id].push(image.url);
      return acc;
    }, {});

    return items.map((item) => ({
      ...item.toJSON(),
      images: imagesByItemId[item.id] || [],
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
    if (!item) {
      throw new Error("Item not found");
    }

    const images = await Image.findAll({
      where: {
        reference_id: item_id,
        reference_type: "item",
      },
    });

    return {
      ...item.toJSON(),
      images: images.map((image) => image.url),
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
    const itemIds = items.map((item) => item.id);
    const images = await Image.findAll({
      where: {
        reference_id: itemIds,
        reference_type: "item",
      },
    });

    return items.map((item) => ({
      ...item.toJSON(),
      images: images
        .filter((image) => image.reference_id === item.id)
        .map((image) => image.url),
    }));
  } catch (e) {
    throw e;
  }
};

const updateItem = async (id, data, images) => {
  try {
    let { name, price, stock, description, status, purchase_limit_per_day } =
      data;
    let item = await Item.findByPk(id);
    if (!item) {
      throw new Error("Item not found");
    }
    name ? (item.name = name) : (item.name = item.name);
    purchase_limit_per_day
      ? (item.purchase_limit_per_day = purchase_limit_per_day)
      : (item.purchase_limit_per_day = item.purchase_limit_per_day);
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
      item.status = stock > 0 ? "available" : "sold_out";
    }

    let uploadedImages = [];

    if (images && images.length > 0) {
      const existingImages = await Image.findAll({
        where: {
          reference_id: id,
          reference_type: "item",
        },
      });
      for (const image of existingImages) {
        if (image.url) {
          const publicId = image.url.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(`images/${publicId}`);
        }
        await image.destroy();
      }

      uploadedImages = await uploadImages(images, id, "item");
      if (!uploadedImages || uploadedImages.length === 0) {
        throw new Error("Failed to upload images");
      }
    }

    await item.save();
    return {
      ...item.toJSON(),
      images: uploadedImages.map((image) => image.url),
    };
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

    const images = await Image.findAll({
      where: {
        reference_id: item_id,
        reference_type: "item",
      },
    });

    for (const image of images) {
      if (image.url) {
        const publicId = image.url.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`images/${publicId}`);
      }
      await image.destroy();
    }

    await item.destroy();
    return { message: "Item and associated images deleted successfully" };
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

const getItemByPublicId = async (public_id) => {
  try {
    if (!public_id) {
      throw new Error("Public ID is required");
    }

    const item = await Item.findOne({ where: { public_id } });
    if (!item) {
      throw new Error("Item not found");
    }

    const images = await Image.findAll({
      where: {
        reference_id: item.id,
        reference_type: "item",
      },
    });

    return {
      ...item.toJSON(),
      images: images.map((image) => image.url),
    };
  } catch (e) {
    throw e;
  }
};

const updateItemByPublicId = async (public_id, data, images) => {
  try {
    let { name, price, stock, description } = data;
    let item = await Item.findOne({ where: { public_id } });
    if (!item) {
      throw new Error("Item not found");
    }
    name ? (item.name = name) : (item.name = item.name);
    item.status = "pending";
    description
      ? (item.description = description)
      : (item.description = item.description);
    price ? (item.price = price) : (item.price = item.price);

    if (stock !== undefined) {
      if (stock < 0) {
        throw new Error("Stock cannot be negative");
      }
      item.stock = stock;
    }

    let uploadedImages = [];

    if (images && images.length > 0) {
      const existingImages = await Image.findAll({
        where: {
          reference_id: item.id,
          reference_type: "item",
        },
      });
      for (const image of existingImages) {
        if (image.url) {
          const publicId = image.url.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(`images/${publicId}`);
        }
        await image.destroy();
      }

      uploadedImages = await uploadImages(images, item.id, "item");
      if (!uploadedImages || uploadedImages.length === 0) {
        throw new Error("Failed to upload images");
      }
    }

    await item.save();
    return {
      ...item.toJSON(),
      images: uploadedImages.map((image) => image.url),
    };
  } catch (e) {
    throw e;
  }
};

const deleteItemByPublicId = async (public_id) => {
  try {
    const item = await Item.findOne({ where: { public_id } });
    if (!item) {
      throw new Error("Item not found");
    }

    return await deleteItem(item.id);
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
  getItemByPublicId,
  updateItemByPublicId,
  deleteItemByPublicId,
};
