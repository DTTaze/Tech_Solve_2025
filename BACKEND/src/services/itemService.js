const { nanoid } = require("nanoid");
const db = require("../models/index");
const Item = db.Item;
const User = db.User;
const Image = db.Image;
const DeliveryOrder = db.DeliveryOrder
const purchaseQueue = require("../queues/purchaseQueue");
const { uploadImages } = require("../services/imageService");
const { sequelize } = require("../models");
const { where } = require("sequelize");
const cloudinary = require("cloudinary").v2;
const { emitStockUpdate } = require("./socketService");
const { getCache, setCache, deleteCache } = require("../utils/cache");

const createItem = async (itemData, user_id, images) => {
  try {
    if (!itemData.name || !itemData.price || !itemData.stock) {
      throw new Error("Missing required fields (name, price, stock)");
    }

    if (!user_id) {
      throw new Error("Creator ID is required");
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
          creator_id: user_id,
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
    await deleteCache("items:all");
    await deleteCache(`items:user:${user_id}`);
    return result;
  } catch (error) {
    console.error("Error creating item:", error);
    throw error;
  }
};

const getAllItems = async () => {
  const cacheKey = "items:all";
  let items = await getCache(cacheKey);

  if (!items) {
    const dbItems = await Item.findAll({
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "username"],
        },
      ],
    });
    const itemIds = dbItems.map((item) => item.id);
    const images = await Image.findAll({
      where: {
        reference_id: itemIds,
        reference_type: "item",
      },
    });

    const imagesByItemId = images.reduce((acc, image) => {
      if (!acc[image.reference_id]) acc[image.reference_id] = [];
      acc[image.reference_id].push(image.url);
      return acc;
    }, {});

    items = dbItems.map((item) => ({
      ...item.toJSON(),
      images: imagesByItemId[item.id] || [],
    }));

    await setCache(cacheKey, items);
  }
  return items;
};

const getItemByIdItem = async (item_id) => {
  const cacheKey = `item:${item_id}`;
  let item = await getCache(cacheKey);

  if (!item) {
    const dbItem = await Item.findByPk(item_id);
    if (!dbItem) throw new Error("Item not found");

    const images = await Image.findAll({
      where: { reference_id: item_id, reference_type: "item" },
    });

    item = {
      ...dbItem.toJSON(),
      images: images.map((img) => img.url),
    };
    await setCache(cacheKey, item);
  }

  return item;
};

const getItemByIdUser = async (user_id) => {
  const cacheKey = `items:user:${user_id}`;
  let items = await getCache(cacheKey);

  if (!items) {
    const dbItems = await Item.findAll({ where: { creator_id: user_id } });
    const itemIds = dbItems.map((item) => item.id);
    const images = await Image.findAll({
      where: { reference_id: itemIds, reference_type: "item" },
    });

    items = dbItems.map((item) => ({
      ...item.toJSON(),
      images: images
        .filter((img) => img.reference_id === item.id)
        .map((img) => img.url),
    }));
    await setCache(cacheKey, items);
  }

  return items;
};

const updateItem = async (id, data, images) => {
  try {
    let { name, price, stock, description, status, purchase_limit_per_day } =
      data;
    let item = await Item.findByPk(id);
    if (!item) {
      throw new Error("Item not found");
    }

    const originalStock = item.stock;
    const originalStatus = item.status;

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

    // Nếu có thay đổi về stock hoặc status, emit sự kiện
    if (originalStock !== item.stock || originalStatus !== item.status) {
      emitStockUpdate(id, item.stock, {
        name: item.name,
        price: item.price,
        status: item.status,
      });
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
    await deleteCache(`item:${id}`);
    await deleteCache("items:all");
    await deleteCache(`items:user:${item.creator_id}`);
    await deleteCache(`item:public_id:${item.public_id}`);
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
    await deleteCache(`item:${item_id}`);
    await deleteCache("items:all");
    await deleteCache(`items:user:${item.creator_id}`);
    await deleteCache(`item:public_id:${item.public_id}`);
    return { message: "Item and associated images deleted successfully" };
  } catch (e) {
    throw e;
  }
};

const purchaseItem = async (user_id,item_id,name,phone,address,weight,payment_type,quantity) => {
  try {
    if (!user_id || !item_id || quantity <= 0) {
      throw new Error("Invalid input data");
    }

    const result = await purchaseQueue.add("purchase", {user_id,item_id,name,phone,address,weight,payment_type,quantity});

    return { message: "Purchase request is in queue", job_id: result.id };
  } catch (error) {
    throw error;
  }
};

const getItemByPublicId = async (public_id) => {
  const cacheKey = `item:public_id:${public_id}`;
  let item = await getCache(cacheKey);

  if (!item) {
    const dbItem = await Item.findOne({ where: { public_id } });
    if (!dbItem) throw new Error("Item not found");

    const images = await Image.findAll({
      where: { reference_id: dbItem.id, reference_type: "item" },
    });

    item = {
      ...dbItem.toJSON(),
      images: images.map((img) => img.url),
    };
    await setCache(cacheKey, item);
  }

  return item;
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
    await deleteCache(`item:${id}`);
    await deleteCache("items:all");
    await deleteCache(`items:user:${item.creator_id}`);
    await deleteCache(`item:public_id:${item.public_id}`);
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

const confirmOrder = async (order_id,decision) => {
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
  confirmOrder
};
