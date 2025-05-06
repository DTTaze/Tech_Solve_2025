const { nanoid } = require("nanoid");
const db = require("../models/index");
const Product = db.Product;
const User = db.User;
const Image = db.Image;
const { uploadImages } = require("../services/imageService");
const { sequelize } = require("../models");
const cloudinary = require("cloudinary").v2;
const { getCache, setCache, deleteCache } = require("../utils/cache");

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
      let productFormat;
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
        productFormat = {
          ...newProduct.toJSON(),
          imagesId: uploadedImages.map((img) => img.id),
        };
      } else {
        productFormat = {
          ...newProduct.toJSON(),
          imagesId: [],
        };
      }

      await setCache(`product:id:${newProduct.id}`, productFormat, 60 * 60);
      await setCache(
        `product:public_id:${newProduct.public_id}`,
        newProduct.id,
        60 * 60
      );
      const cachedProductIds = await getCache("products:all");
      if (cachedProductIds) {
        const productIds = cachedProductIds || [];
        productIds.push(newProduct.id);
        await setCache("products:all", productIds, 60 * 60);
      }

      return newProduct;
    });

    return result;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

const getImagesFromListOfIds = async (imagesId) => {
  try {
    let images = [];
    for (const imageId of imagesId) {
      const cacheImage = await getCache(`image:id:${imageId}`);
      if (cacheImage) {
        images.push(cacheImage);
        continue;
      }
      const image = await Image.findByPk(imageId);
      if (image) {
        images.push(image);
        await setCache(`image:id:${imageId}`, image, 60 * 60);
      }
    }
    const imagesByProductId = images.reduce((acc, image) => {
      if (!acc[image.reference_id]) acc[image.reference_id] = [];
      acc[image.reference_id].push(image.url);
      return acc;
    }, {});

    return imagesByProductId;
  } catch (error) {
    console.error("Error getting images from list of IDs:", error);
    throw error;
  }
};

const getSellerFromProduct = async (seller_id) => {
  try {
    const cacheUser = await getCache(`user:id:${seller_id}`);
    if (cacheUser) {
      const user = cacheUser;
      const userFormat = {
        id: seller_id,
        username: user.username,
      };
      return userFormat;
    }

    const user = await User.findByPk(seller_id, {
      attributes: ["id", "username"],
    });
    return user;
  } catch (error) {
    console.error("Error getting seller from product:", error);
    throw error;
  }
};

const getProductFromListOfIds = async (productIds) => {
  try {
    let products = [];
    for (const productId of productIds) {
      const cacheProduct = await getCache(`product:id:${productId}`);
      if (cacheProduct) {
        const product = cacheProduct;
        let imagesOfProduct;
        if (product.imagesId && product.imagesId.length > 0) {
          imagesOfProduct = await getImagesFromListOfIds(product.imagesId);
        }

        const user = await getSellerFromProduct(product.seller_id);
        let productFormat = {
          ...product,
          seller: user,
          images: (imagesOfProduct && imagesOfProduct[productId]) || [],
        };
        delete productFormat.imagesId;
        products.push(productFormat);
        continue;
      }

      const product = await Product.findByPk(productId);
      if (!product) {
        throw new Error("Product not found");
      }

      const seller = await getSellerFromProduct(product.seller_id);

      const imagesOfProduct = await Image.findAll({
        where: {
          reference_id: productId,
          reference_type: "product",
        },
      });

      const imagesByProductId = imagesOfProduct.reduce((acc, image) => {
        if (!acc[image.reference_id]) acc[image.reference_id] = [];
        acc[image.reference_id].push(image.url);
        return acc;
      }, {});

      let productFormat = {
        ...product.toJSON(),
        seller: seller,
        images: imagesByProductId[productId] || [],
      };
      products.push(productFormat);

      // Cache the product for future use
      let productFormatCache = {
        ...product.toJSON(),
        imagesId: imagesOfProduct.map((img) => img.id),
      };
      await setCache(`product:id:${productId}`, productFormatCache, 60 * 60);
    }

    return products.filter((product) => product !== null);
  } catch (error) {
    console.error("Error getting products from list of IDs:", error);
    throw error;
  }
};

const getAllProducts = async () => {
  try {
    const cachedProductIds = await getCache("products:all");
    if (cachedProductIds) {
      const productIds = cachedProductIds;

      const totalProductsCount = await Product.count();
      if (productIds.length === totalProductsCount) {
        const products = await getProductFromListOfIds(productIds);
        return products.filter((product) => product !== null);
      } else {
        throw new Error("Product IDs in cache do not match database count");
      }
    }

    const products = await Product.findAll({
      include: [
        {
          as: "seller",
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

    const result = products.map((p) => ({
      ...p.toJSON(),
      images: imagesByProductId[p.id] || [],
    }));

    const productFormat = products.map((p) => ({
      ...p.toJSON(),
      imagesId: images.map((img) => img.id),
    }));

    await setCache("products:all", productIds, 60 * 60);
    await Promise.all(
      productFormat.map((product) =>
        setCache(`product:id:${product.id}`, product, 60 * 60)
      )
    );

    return result;
  } catch (e) {
    throw e;
  }
};

const getAllAvailableProducts = async () => {
  try {
    const products = await getAllProducts();
    const availableProducts = products.filter(
      (product) => product.post_status === "public"
    );
    return availableProducts;
  } catch (e) {
    throw e;
  }
};

const getProductByIdUser = async (user_id) => {
  try {
    if (!user_id) throw new Error("User ID is required");

    const products = await getAllProducts();
    const userProducts = products.filter(
      (product) => product.seller.id === user_id
    );
    if (userProducts.length === 0) {
      throw new Error("No products found for this seller");
    }
    return userProducts;
  } catch (e) {
    throw e;
  }
};

const updateProduct = async (product, data, images) => {
  try {
    let { name, price, description, post_status, category, product_status } =
      data;

    if (!product) throw new Error("Product not found");

    if (name) product.name = name;
    if (price !== undefined) product.price = price;
    if (description !== undefined) product.description = description;
    if (post_status) product.post_status = post_status;
    if (category) product.category = category;
    if (product_status) product.product_status = product_status;

    let uploadedImages = [];
    const id = product.id;
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

      const cacheProduct = await getCache(`product:id:${id}`);
      if (cacheProduct && cacheProduct.imagesId) {
        for (const imageId of cacheProduct.imagesId) {
          await deleteCache(`image:id:${imageId}`);
        }
      }

      uploadedImages = await uploadImages(images, id, "product");
      if (!uploadedImages || uploadedImages.length === 0) {
        throw new Error("Failed to upload images");
      }
    }

    await product.save();

    const productFormat = {
      ...product.toJSON(),
      imagesId: uploadedImages.map((img) => img.id),
    };
    await setCache(`product:id:${id}`, productFormat, 60 * 60);
    await setCache(`product:public_id:${product.public_id}`, id, 60 * 60);

    const cachedProductIds = await getCache("products:all");
    if (cachedProductIds) {
      const productIds = cachedProductIds;
      const index = productIds.indexOf(id);
      if (index !== -1) {
        productIds[index] = id;
        await setCache("products:all", productIds, 60 * 60);
      }
    }

    return {
      ...product.toJSON(),
      images: uploadedImages.map((img) => img.url),
    };
  } catch (e) {
    throw e;
  }
};

const updateProductById = async (id, data, images) => {
  try {
    const product = await Product.findByPk(id);
    const result = await updateProduct(product, data, images);
    return result;
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

    await deleteCache(`product:id:${product_id}`);
    await deleteCache(`product:public_id:${product.public_id}`);
    for (const image of images) {
      await deleteCache(`image:id:${image.id}`);
    }

    await product.destroy();

    const cachedProductIds = await getCache("products:all");
    if (cachedProductIds) {
      const productIds = cachedProductIds;
      const index = productIds.indexOf(product_id);
      if (index !== -1) {
        productIds.splice(index, 1);
        await setCache("products:all", productIds, 60 * 60);
      }
    }

    return { message: "Product and associated images deleted successfully" };
  } catch (e) {
    throw e;
  }
};

const updateProductByPublicId = async (public_id, data, images) => {
  try {
    const product = await Product.findOne({ where: { public_id } });
    if (!product) throw new Error("Product not found");
    const result = await updateProduct(product, data, images);
    return result;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductByIdUser,
  updateProductById,
  updateProductByPublicId,
  deleteProduct,
  getAllAvailableProducts,
};
