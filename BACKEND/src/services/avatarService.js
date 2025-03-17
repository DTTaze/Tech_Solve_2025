const { image } = require("../config/cloudinary.js");
const db = require("../models/index.js");
const User = db.User;
const cloudinary = require("../config/cloudinary.js");

const uploadAvatar = async (file, userId) => {
    try {
        if (!file) throw new Error("No file provided");
        if (!userId) throw new Error("User ID is required");

        const user = await User.findByPk(userId);
        if (!user) throw new Error("User not found");

        if (user.avatarURL) throw new Error("User already has an avatar.");

        const result = await cloudinary.uploader.upload(file.path, {
            folder: "avatars",
        });

        user.avatarURL = result.secure_url;
        await user.save();

        return { user };
    } catch (error) {
        throw new Error(error.message);
    }
};

const getAllAvatar = async () => {
    try {
        const users = await User.findAll({
            attributes: ["id", "username", "avatarURL"], // Chỉ lấy các trường cần thiết
        });
        return users;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getAvatarById = async (id) => {
    try {
        const user = await User.findByPk(id, {
            attributes: ["id", "username", "avatarURL"],
        });

        if (!user) throw new Error("User not found");

        return user;
    } catch (error) {
        throw new Error(error.message);
    }
};

const updateAvatar = async (id, file) => {
    try {
        const user = await User.findByPk(id);
        if (!user) throw new Error("User not found");

        if (user.avatarURL) {
            const publicId = user.avatarURL.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(`avatars/${publicId}`);
        }

        const result = await cloudinary.uploader.upload(file.path, {
            folder: "avatars",
            resource_type: "image",
        });

        user.avatarURL = result.secure_url;
        await user.save();

        return user;
    } catch (error) {
        throw new Error(error.message);
    }
};

const deleteAvatar = async (id) => {
    try {
        const user = await User.findByPk(id);
        if (!user) return { error: "User not found" };

        if (user.avatarURL) {
            const publicId = user.avatarURL.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(`avatars/${publicId}`);
        }

        user.avatarURL = null;
        await user.save();

        return { message: "Avatar deleted successfully" };
    } catch (error) {
        console.error("Error deleting avatar:", error);
        return { error: "Internal server error" };
    }
};


module.exports = { 
    uploadAvatar, 
    getAllAvatar, 
    getAvatarById, 
    updateAvatar,
    deleteAvatar
};
