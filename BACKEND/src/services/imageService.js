const db = require("../models/index");
const Image = db.Image;
const cloudinary = require("../config/cloudinary");
const { getCache, setCache, deleteCache } = require("../utils/cache");

const IMAGE_KEY_PREFIX = "image:id:";
const IMAGE_ALL_KEY = "image:all";

const uploadImages = async (files, reference_id, reference_type) => {
  if (!files || files.length === 0) throw new Error("No files provided");

  const uploadedImages = [];

  for (const file of files) {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "images",
    });

    const image = await Image.create({
      url: result.secure_url,
      reference_id,
      reference_type,
    });

    uploadedImages.push(image);
    await setCache(`${IMAGE_KEY_PREFIX}${image.id}`, image);
  }

  return uploadedImages;
};

const getImageById = async (id) => {
  const key = `${IMAGE_KEY_PREFIX}${id}`;

  const cached = await getCache(key);
  if (cached) return cached;

  const image = await Image.findByPk(id);
  if (!image) throw new Error("Image not found");

  await setCache(key, image);
  return image;
};

const getAllImages = async () => {
  const cached = await getCache(IMAGE_ALL_KEY);
  if (cached) return cached;

  const images = await Image.findAll();
  await setCache(IMAGE_ALL_KEY, images);
  return images;
};

const updateImage = async (id, file) => {
  const image = await Image.findByPk(id);
  if (!image) throw new Error("Image not found");

  if (image.url) {
    const publicId = image.url.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`images/${publicId}`);
  }

  const result = await cloudinary.uploader.upload(file.path, {
    folder: "images",
  });

  image.url = result.secure_url;
  await image.save();

  await setCache(`${IMAGE_KEY_PREFIX}${id}`, image);
  return image;
};

const deleteImage = async (id) => {
  const image = await Image.findByPk(id);
  if (!image) return { error: "Image not found" };

  if (image.url) {
    const publicId = image.url.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`images/${publicId}`);
  }

  await image.destroy();
  await deleteCache(`${IMAGE_KEY_PREFIX}${id}`);

  return { message: "Image deleted successfully" };
};

const deleteImages = async (reference_id, reference_type) => {
  const images = await Image.findAll({
    where: { reference_id, reference_type },
  });

  const deletedUrls = [];

  for (const image of images) {
    if (image.url) {
      deletedUrls.push(image.url);
      const publicId = image.url.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`images/${publicId}`);
    }

    await deleteCache(`${IMAGE_KEY_PREFIX}${image.id}`);
    await image.destroy();
  }

  return deletedUrls;
};

module.exports = {
  uploadImages,
  getImageById,
  getAllImages,
  updateImage,
  deleteImage,
  deleteImages,
};
