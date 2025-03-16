const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Cấu hình lưu video vào Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "videos", // Thư mục lưu video
    resource_type: "video", // Chỉ nhận video
    allowed_formats: ["mp4", "avi", "mkv", "mov"], // Định dạng video hợp lệ
  },
});

const uploadVideo = multer({ storage });

module.exports = uploadVideo;
