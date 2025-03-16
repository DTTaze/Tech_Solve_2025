const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const axios = require("axios");
const db = require("../models/index.js");
const cloudinary = require("../config/cloudinary.js");
const Video = db.Video;

const uploadAndCompressVideo = async (file, title, userId) => {
  console.log("uploadAndCompressVideo", file, title, userId);

  const uploadsDir = path.join(__dirname, "../uploads");
  const localPath = path.join(uploadsDir, "temp_" + file.filename);
  const compressedPath = path.join(uploadsDir, "compressed_" + file.filename);

  try {
    // Step 1: Download the video file
    const response = await axios({
      url: file.path,
      method: "GET",
      responseType: "stream",
    });

    const writer = fs.createWriteStream(localPath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    console.log("Video downloaded:", localPath);

    // Step 2: Compress the video using FFmpeg
    await new Promise((resolve, reject) => {
      ffmpeg(localPath)
        .output(compressedPath)
        .videoCodec("libx264")
        .size("1280x720")
        .on("end", resolve)
        .on("error", reject)
        .run();
    });

    console.log("Video compressed:", compressedPath);

    // Step 3: Upload the compressed video to Cloudinary
    const result = await cloudinary.uploader.upload(compressedPath, {
      resource_type: "video",
      folder: "compressed_videos",
      allowed_formats: ["mp4", "avi", "mkv", "mov"],
    });

    console.log("Upload successful:", result.secure_url);

    // Step 4: Save video information to the database
    const videoData = {
      title,
      url: result.secure_url, // Public URL from Cloudinary
      filename: result.public_id,
      userId,
    };

    await createVideo(videoData);

    // Step 5: Delete the local files
    const allowedExtensions = ["mp4", "avi", "mkv", "mov"];

    fs.readdir(uploadsDir, (err, files) => {
      if (err) {
        console.error("Error reading uploads directory:", err);
        return;
      }
      files.forEach((file) => {
        const ext = path.extname(file).slice(1); // Get the file extension without the dot Ex: mp4, avi, mkv, mov
        if (allowedExtensions.includes(ext)) {
          fs.unlink(path.join(uploadsDir, file), (err) => {
            if (err) {
              console.error("Error deleting file:", file, err);
            } else {
              console.log("Deleted file:", file);
            }
          });
        }
      });
    });

    return videoData;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Video upload failed");
  }
};

const getAllVideos = async () => {
  try {
    return await Video.findAll();
  } catch (e) {
    throw new Error("Failed to fetch videos");
  }
};

const getVideoById = async (idUser, idVideo) => {
  try {
    if (!idUser) throw new Error("User ID is required");

    idUser = Number(idUser);
    idVideo = Number(idVideo);

    if (!Number.isInteger(idUser) || idUser <= 0) {
      throw new Error("Invalid User ID");
    }

    if (!Number.isInteger(idVideo) || idVideo <= 0) {
      idVideo = null;
    }

    const condition = idVideo ? { id: idVideo, userId: idUser } : { userId: idUser };

    const videos = await Video.findAll({ where: condition });

    if (!videos.length) throw new Error("No videos found");

    return videos;
  } catch (e) {
    console.error("Error fetching video:", e.message);
    throw new Error("Failed to fetch video");
  }
};

const updateVideo = async (id, data) => {
  try {
    let { title, url, filename } = data;
    if (!id) throw new Error("Video ID is required");

    if (!title && !url && !filename) {
      throw new Error("At least one field (title, url, filename) must be provided");
    }

    const video = await Video.findByPk(id);
    if (!video) throw new Error("Video not found");

    await video.update({ title, url, filename });
    return video;
  } catch (e) {
    throw new Error("Failed to update video");
  }
};

const deleteVideo = async (idUser, idVideo) => {
  try {
    if (!idUser) throw new Error("User ID is required");
    idUser = Number(idUser);
    idVideo = Number(idVideo);

    if (!Number.isInteger(idUser) || idUser <= 0) {
      throw new Error("Invalid User ID");
    }

    if (!Number.isInteger(idVideo) || idVideo <= 0) {
      idVideo = null;
    }

    const condition = idVideo ? { id: idVideo, userId: idUser } : { userId: idUser };

    const videos = await Video.findAll({ where: condition });

    if (!videos.length) throw new Error("No videos found");

    await Video.destroy({ where: condition });

    return { message: "Video(s) deleted successfully" };
  } catch (e) {
    console.error("Error deleting video:", e.message);
    throw new Error("Failed to delete video");
  }
};



module.exports = {
  uploadAndCompressVideo,
  getAllVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
};
