const db = require("../models/index.js");
const Image = db.Image;
const cloudinary = require("../config/cloudinary.js");

const uploadImage = async (file, reference_id, reference_type) => {
    try {
        if (!file) throw new Error("No file provided");
    
        // Upload ảnh lên Cloudinary
        const result = await cloudinary.uploader.upload(file.path, {
            folder: "images",
        });
    
        // Lưu ảnh vào database
        const image = await Image.create({
            url: result.secure_url,
            reference_id,
            reference_type,
        });
    
        return image;
    } catch (error) {
        throw new Error(error.message);   
    }
};
  
const getImageById = async (id) => {
    try {
        const image = await Image.findByPk(id);
    
        if (!image) throw new Error("Image not found");
    
        return image;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getAllImages = async () => {
    try {
        const images = await Image.findAll();
        return images;
    } catch (error) {
        throw new Error(error.message);
    }
}

const updateImage = async (id, file) => {
    try {
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
    
        return image;
    } catch (error) {
        throw new Error(error.message);
    }
};

const deleteImage = async (id) => {
    try {
        const image = await Image.findByPk(id);
        if (!image) return { error: "Image not found" };
    
        if (image.url) {
            const publicId = image.url.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(`images/${publicId}`);
        }
    
        await image.destroy();
    
        return { message: "Image deleted successfully" };
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = { 
    uploadImage,
    getImageById,
    getAllImages,
    updateImage,
    deleteImage,
};