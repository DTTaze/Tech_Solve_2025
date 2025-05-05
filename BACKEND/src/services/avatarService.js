const { Op } = require("sequelize");
const db = require("../models/index.js");
const User = db.User;
const cloudinary = require("../config/cloudinary.js");
const { getCache, setCache, deleteCache } = require("../utils/cache");

const uploadAvatar = async (file, user_id) => {
  try {
    if (!file) throw new Error("No file provided");
    if (!user_id) throw new Error("User ID is required");

    const user = await User.findByPk(user_id);
    if (!user) throw new Error("User not found");

    if (user.avatar_url) throw new Error("User already has an avatar");

    const result = await cloudinary.uploader.upload(file.path, {
      folder: "avatars",
    });

    await user.update({ avatar_url: result.secure_url });

    await deleteCache(`user:${user.id}:avatar`);
    await deleteCache("avatars");

    return user;
  } catch (e) {
    throw e;
  }
};

const getAllAvatars = async () => {
  try {
    const cachedAvatars = await getCache("avatars");
    if (cachedAvatars) {
      return cachedAvatars;
    }

    const avatars = await User.findAll({
      attributes: ["id", "username", "avatar_url"],
      where: { avatar_url: { [Op.ne]: null } },
    });

    await setCache("avatars", avatars);

    return avatars;
  } catch (e) {
    throw e;
  }
};

const getAvatarById = async (id) => {
  try {
    const cacheKey = `user:${id}:avatar`;
    const cachedAvatar = await getCache(cacheKey);
    if (cachedAvatar) {
      return cachedAvatar;
    }

    const user = await User.findByPk(id, {
      attributes: ["id", "username", "avatar_url"],
    });

    if (!user) throw new Error("User not found");

    await setCache(cacheKey, user);

    return user;
  } catch (e) {
    throw e;
  }
};

const updateAvatar = async (id, file) => {
  try {
    if (!file) throw new Error("No file provided");

    const user = await User.findByPk(id);
    if (!user) throw new Error("User not found");

    let publicId = null;
    if (user.avatar_url) {
      publicId = user.avatar_url.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`avatars/${publicId}`);
    }

    const result = await cloudinary.uploader.upload(file.path, {
      folder: "avatars",
      resource_type: "image",
    });

    await user.update({ avatar_url: result.secure_url });

    await deleteCache(`user:${id}:avatar`);
    await deleteCache("avatars");

    return user;
  } catch (e) {
    throw e;
  }
};

const deleteAvatar = async (id) => {
  try {
    const user = await User.findByPk(id);
    if (!user) throw new Error("User not found");

    if (user.avatar_url) {
      const publicId = user.avatar_url.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`avatars/${publicId}`);
    }

    await user.update({ avatar_url: null });

    await deleteCache(`user:${id}:avatar`);
    await deleteCache("avatars");

    return { message: "Avatar deleted successfully" };
  } catch (e) {
    throw e;
  }
};

module.exports = {
  uploadAvatar,
  getAllAvatars,
  getAvatarById,
  updateAvatar,
  deleteAvatar,
};
