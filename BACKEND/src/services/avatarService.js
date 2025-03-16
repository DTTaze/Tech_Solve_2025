const { image } = require("../config/cloudinary.js");
const db = require("../models/index.js");
const Avatar = db.Avatar;
const User = db.User;
const cloudinary = require("../config/cloudinary.js");

const uploadAvatar = async (file, userId) => {
    try {
        if (!file) throw new Error("No file provided");
        if (!userId) throw new Error("User ID is required");

        const result = await cloudinary.uploader.upload(file.path, {
            folder: "avatars",
        });

        const avatar = await Avatar.create({
            imageUrl: result.secure_url,
        });

        const user = await User.findByPk(userId);
        if (!user) throw new Error("User not found");

        user.avatarId = avatar.id;
        await user.save();

        return { avatar, user };
    } catch (error) {
        throw new Error(error.message);
    }
};


const getAllAvatar = async () => {
    try {
      const avatars = await Avatar.findAll();
      return avatars;
    } catch (error) {
      throw new Error(error.message);
    }
  };

const getAvatarById = async (id) => {
    try {
      const avatar = await Avatar.findByPk(id);
      return avatar;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  
const updateAvatar = async (id, file) => {
    try {
        // Tìm avatar theo ID
        const avatar = await Avatar.findByPk(id);
        if (!avatar) throw new Error("Avatar not found");

        // Xóa ảnh cũ khỏi Cloudinary nếu có
        if (avatar.imageUrl) {
        const publicId = avatar.imageUrl.split("/").pop().split(".")[0]; // Lấy public_id từ URL
        await cloudinary.uploader.destroy(`avatars/${publicId}`);
        }

        // Upload ảnh mới lên Cloudinary
        const result = await cloudinary.uploader.upload(file.path, {
        folder: "avatars",
        resource_type: "image",
        });

        // Cập nhật URL mới vào database
        avatar.imageUrl = result.secure_url;
        await avatar.save();

        return avatar;
    } catch (error) {
        throw new Error(error.message);
    }
};

const deleteAvatar = async (id) => {
    try {
        const avatar = await Avatar.findByPk(id);
        if (!avatar) return { error: "Avatar not found" }; 

        // Xóa ảnh trên Cloudinary nếu có
        if (avatar.imageUrl) {
            const publicId = avatar.imageUrl.split("/").pop().split(".")[0]; 
            await cloudinary.uploader.destroy(`avatars/${publicId}`);
        }

        // Xóa avatar trong database
        await avatar.destroy();

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
