const db = require("../models/index");
const Image = db.Image;
const cloudinary = require("../config/cloudinary");
const {redisClient} = require("../config/configRedis");

const uploadImages = async (files, reference_id, reference_type) => {
    try {
        if (!files || files.length === 0) throw new Error("No files provided");
        console.log("Files:", files);

        const uploadedImages = [];

        for (const file of files) {
            const result = await cloudinary.uploader.upload(file.path, {folder: "images",});

            const image = await Image.create({
            url: result.secure_url,
            reference_id,
            reference_type,
            });

            uploadedImages.push(image); 
            await redisClient.set(`image:id:${image.id}`, JSON.stringify(image), 'EX', 60 * 60 );
        }
        return uploadedImages;
    } catch (error) {
      throw new Error(error.message);
    }
};
  
const getImageById = async (id) => {
    try {

        const cacheImage = await redisClient.get(`image:id:${id}`);
        if (cacheImage) {
            console.log("cacheImage", cacheImage);
            return JSON.parse(cacheImage);
        }

        const image = await Image.findByPk(id);
    
        if (!image) throw new Error("Image not found");
    
        await redisClient.set(`image:id:${id}`, JSON.stringify(image), 'EX', 60 * 60 );
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
        await redisClient.set(`image:id:${id}`, JSON.stringify(image), 'EX', 60 * 60 );
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
        await redisClient.del(`image:id:${id}`);
        return { message: "Image deleted successfully" };
    } catch (error) {
        throw new Error(error.message);
    }
}

const deleteImages = async (reference_id, reference_type) => {
    try {
        let imagesBeforeDelete = [];
        const images = await Image.findAll({
            where: {
                reference_id,
                reference_type,
            },
        });
    
        for (const image of images) {
            if (image.url) {
                imagesBeforeDelete.push(image.url);
                const publicId = image.url.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(`images/${publicId}`);
            }
            await redisClient.del(`image:id:${image.id}`);
            await image.destroy();
        }
        
        return imagesBeforeDelete;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = { 
    uploadImages,
    getImageById,
    getAllImages,
    updateImage,
    deleteImage,
    deleteImages,
};