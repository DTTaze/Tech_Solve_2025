const videoService = require("../service/videoService");

// CREATE - Upload video
const uploadVideo = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const newVideo = await videoService.createVideo({
      title: req.body.title,
      url: req.file.path,
      filename: req.file.filename,
      userId: req.body.userId,
    });

    res.success("Upload video success", newVideo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ - Lấy danh sách video
const getAllVideos = async (req, res) => {
  try {
    const videos = await videoService.getAllVideos();
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ - Lấy thông tin 1 video theo ID
const getVideoById = async (req, res) => {
  try {
    const video = await videoService.getVideoById(req.params.id);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE - Cập nhật video
const updateVideo = async (req, res) => {
  try {
    const video = await videoService.getVideoById(req.params.id);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    await videoService.updateVideo(req.params.id, {
      title: req.body.title,
      url: req.file.path,
      filename: req.file.filename,
    });

    res.json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE - Xóa video
const deleteVideo = async (req, res) => {
  try {
    const video = await videoService.getVideoById(req.params.id);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    await videoService.deleteVideo(req.params.id);
    res.json({ message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Xuất các hàm để dùng trong route
module.exports = {
  uploadVideo,
  getAllVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
};
