const db = require("../models/index.js");
const Video = db.Video;

const createVideo = async ({ title, url, filename, userId }) => {
  try {
    if (!title || !url || !filename || userId === undefined) {
      throw new Error("Title, URL, filename, and userId are required");
    }
    if (typeof userId !== "number" || userId <= 0) {
      throw new Error("Invalid userId");
    }

    return await Video.create({ title, url, filename, userId });
  } catch (e) {
    throw new Error("Failed to create video");
  }
};

const getAllVideos = async () => {
  try {
    return await Video.findAll();
  } catch (e) {
    throw new Error("Failed to fetch videos");
  }
};

const getVideoById = async (id) => {
  try {
    if (!id) throw new Error("Video ID is required");

    const video = await Video.findByPk(id);
    if (!video) throw new Error("Video not found");

    return video;
  } catch (e) {
    throw new Error("Failed to fetch video");
  }
};

const updateVideo = async (id, data) => {
  try {
    let { title, url, filename } = data;
    if (!id) throw new Error("Video ID is required");
    
    if (!title && !url && !filename) {
      throw new Error(
        "At least one field (title, url, filename) must be provided"
      );
    }

    const video = await Video.findByPk(id);
    if (!video) throw new Error("Video not found");

    await video.update({ title, url, filename });
    return video;
  } catch (e) {
    throw new Error("Failed to update video");
  }
};

const deleteVideo = async (id) => {
  try {
    if (!id) throw new Error("Video ID is required");

    const video = await Video.findByPk(id);
    if (!video) throw new Error("Video not found");

    await video.destroy();
    return { message: "Video deleted successfully" };
  } catch (e) {
    throw new Error("Failed to delete video");
  }
};

module.exports = {
  createVideo,
  getAllVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
};
