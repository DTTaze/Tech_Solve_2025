const db = require("../models/index.js");
const Video = db.Video;

const createVideo = async ({ title, url, filename, userId }) => {
    return await Video.create({ title, url, filename, userId });
};

const getAllVideos = async () => {
    return await Video.findAll();
};

const getVideoById = async (id) => {
    return await Video.findByPk(id);
};

const updateVideo = async (id, { title, url, filename }) => {
    const video = await Video.findByPk(id);
    if (!video) throw new Error("Video not found");

    return await video.update({ title, url, filename });
};

const deleteVideo = async (id) => {
    const video = await Video.findByPk(id);
    if (!video) throw new Error("Video not found");

    await video.destroy();
    return { message: "Video deleted successfully" };
};

// Xuất các hàm để dùng trong controller
module.exports = {
    createVideo,
    getAllVideos,
    getVideoById,
    updateVideo,
    deleteVideo
};
