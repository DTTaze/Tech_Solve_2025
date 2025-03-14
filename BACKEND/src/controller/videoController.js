const videoService = require("../service/videoService");

const handleUploadVideo = async (req, res) => {
  if (!req.file) {
    return res.error(400, "No file uploaded");
  }
  try {
    let result = await videoService.createVideo({
      title: req.body.title,
      url: req.file.path,
      filename: req.file.filename,
      userId: req.body.userId,
    });
    res.success("Upload video success", result);
  } catch (error) {
    return res.error(500, "Failed to upload video", error.message);
  }
};

const handleGetAllVideos = async (req, res) => {
  try {
    let result = await videoService.getAllVideos();
    return res.success("Get list of videos success", result);
  } catch (error) {
    return res.error(500, "Failed to fetch list of videos", error.message);
  }
};

const handleGetVideoById = async (req, res) => {
  try {
    let result = await videoService.getVideoById(req.params.id);
    return res.success("Get video by ID success", result);
  } catch (error) {
    return res.error(500, "Failed to get video by ID", error.message);
  }
};

const handleUpdateVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.error(400, "No file uploaded");
    }
    let result = await videoService.updateVideo(req.params.id, {
      title: req.body.title,
      url: req.file.path,
      filename: req.file.filename,
    });
    return res.success("Update video success", result);
  } catch (error) {
    return res.error(500, "Failed to update video", error.message);
  }
};

const handleDeleteVideo = async (req, res) => {
  try {
    let result = await videoService.deleteVideo(req.params.id);
    return res.success("Delete video success", result);
  } catch (error) {
    return res.error(500, "Failed to delete video", error.message);
  }
};

module.exports = {
  handleUploadVideo,
  handleGetAllVideos,
  handleGetVideoById,
  handleUpdateVideo,
  handleDeleteVideo,
};
