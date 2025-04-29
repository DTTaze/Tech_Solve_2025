const { nanoid } = require("nanoid");
const db = require("../models/index");
const Product = db.Product;
const User = db.User;
const { uploadImages } = require("../services/imageService");
const { sequelize } = require("../models");
const Image = db.Image;
const cloudinary = require("cloudinary").v2;

const createProduct = async (productData, user_id, images) => {
  try {
    if (
      !productData.name ||
      !productData.price ||
      !productData.stock ||
      !productData.category ||
      !productData.product_status
    ) {
      throw new Error(
        "Missing required fields (name, price, stock, category, product_status)"
      );
    }

    if (productData.price < 1) {
      throw new Error("Price must be at least 1");
    }

    if (productData.stock < 1) {
      throw new Error("Stock must be at least 1");
    }

    const result = await sequelize.transaction(async (t) => {
      const newProduct = await Product.create(
        {
          public_id: nanoid(),
          name: productData.name,
          price: productData.price,
          stock: productData.stock,
          description: productData.description,
          seller_id: user_id,
          category: productData.category,
          product_status: productData.product_status,
        },
        { transaction: t }
      );

      if (images && images.length > 0) {
        const uploadedImages = await uploadImages(
          images,
          newProduct.id,
          "product"
        );
        if (uploadedImages.length === 0) {
          throw new Error("Failed to upload images");
        }
      }

      return newProduct;
    });

    return result;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

const getAllProducts = async () => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "username"],
        },
      ],
    });
    const productIds = products.map((p) => p.id);

    const images = await Image.findAll({
      where: {
        reference_id: productIds,
        reference_type: "product",
      },
    });

    const imagesByProductId = images.reduce((acc, image) => {
      if (!acc[image.reference_id]) acc[image.reference_id] = [];
      acc[image.reference_id].push(image.url);
      return acc;
    }, {});

    return products.map((p) => ({
      ...p.toJSON(),
      images: imagesByProductId[p.id] || [],
    }));
  } catch (e) {
    throw e;
  }
};

const getAllAvailableProducts = async () => {
  try {
    const products = await Product.findAll({
      where: {
        post_status: "available",
        stock: {
          [Op.gt]: 0,
        },
      },
      include: [
        {
          model: User,
          as: "users",
          attributes: ["id", "username"],
        },
      ],
    });

    const productIds = products.map((p) => p.id);

    const images = await Image.findAll({
      where: {
        reference_id: productIds,
        reference_type: "product",
      },
    });

    const imagesByProductId = images.reduce((acc, image) => {
      if (!acc[image.reference_id]) acc[image.reference_id] = [];
      acc[image.reference_id].push(image.url);
      return acc;
    }, {});

    return products.map((p) => ({
      ...p.toJSON(),
      images: imagesByProductId[p.id] || [],
    }));
  } catch (e) {
    throw e;
  }
};

const getProductByIdUser = async (user_id) => {
  try {
    if (!user_id) throw new Error("User ID is required");

    const products = await Product.findAll({ where: { seller_id: user_id } });
    const productIds = products.map((p) => p.id);
    const images = await Image.findAll({
      where: {
        reference_id: productIds,
        reference_type: "product",
      },
    });

    return products.map((p) => ({
      ...p.toJSON(),
      images: images
        .filter((img) => img.reference_id === p.id)
        .map((img) => img.url),
    }));
  } catch (e) {
    throw e;
  }
};

const updateProduct = async (id, data, images) => {
  try {
    let { name, price, description, post_status, category, product_status } =
      data;

    const product = await Product.findByPk(id);
    if (!product) throw new Error("Product not found");

    if (name) product.name = name;
    if (price !== undefined) product.price = price;
    if (description !== undefined) product.description = description;
    if (post_status) product.post_status = post_status;
    if (category) product.category = category;
    if (product_status) product.product_status = product_status;

    let uploadedImages = [];

    if (images && images.length > 0) {
      const existingImages = await Image.findAll({
        where: {
          reference_id: id,
          reference_type: "product",
        },
      });

      for (const image of existingImages) {
        if (image.url) {
          const publicId = image.url.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(`images/${publicId}`);
        }
        await image.destroy();
      }

      uploadedImages = await uploadImages(images, id, "product");
      if (!uploadedImages || uploadedImages.length === 0) {
        throw new Error("Failed to upload images");
      }
    }

    await product.save();
    return {
      ...product.toJSON(),
      images: uploadedImages.map((img) => img.url),
    };
  } catch (e) {
    throw e;
  }
};

const deleteProduct = async (product_id) => {
  try {
    if (!product_id) throw new Error("Product ID is required");

    const product = await Product.findByPk(product_id);
    if (!product) throw new Error("Product not found");

    const images = await Image.findAll({
      where: {
        reference_id: product_id,
        reference_type: "product",
      },
    });

    for (const image of images) {
      if (image.url) {
        const publicId = image.url.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`images/${publicId}`);
      }
      await image.destroy();
    }

    await product.destroy();
    return { message: "Product and associated images deleted successfully" };
  } catch (e) {
    throw e;
  }
};

const updateProductByPublicId = async (public_id, data, images) => {
  try {
    let { name, price, description, category, product_status } = data;

    const product = await Product.findOne({ where: { public_id } });
    if (!product) throw new Error("Product not found");

    if (name) product.name = name;
    if (price !== undefined) product.price = price;
    if (description !== undefined) product.description = description;
    if (category) product.category = category;
    if (product_status) product.product_status = product_status;
    let uploadedImages = [];

    if (images && images.length > 0) {
      const existingImages = await Image.findAll({
        where: {
          reference_id: product.id,
          reference_type: "product",
        },
      });

      for (const image of existingImages) {
        if (image.url) {
          const publicId = image.url.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(`images/${publicId}`);
        }
        await image.destroy();
      }

      uploadedImages = await uploadImages(images, product.id, "product");
      if (!uploadedImages || uploadedImages.length === 0) {
        throw new Error("Failed to upload images");
      }
    }

    await product.save();
    return {
      ...product.toJSON(),
      images: uploadedImages.map((img) => img.url),
    };
  } catch (e) {
    throw e;
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductByIdUser,
  updateProduct,
  updateProductByPublicId,
  deleteProduct,
  getAllAvailableProducts,
};
