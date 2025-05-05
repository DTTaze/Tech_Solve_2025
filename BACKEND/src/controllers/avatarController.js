const avatarService = require("../services/avatarService");

const handleUploadAvatar = async (req, res) => {
  try {
    const { file } = req;
    const userId = req.params.user_id || req.user?.id;

    if (!file) {
      return res.error(400, "No file uploaded");
    }

    const result = await avatarService.uploadAvatar(file, userId);
    return res.success("Avatar uploaded successfully", result);
  } catch (error) {
    return res.error(500, "Failed to upload avatar", error.message);
  }
};

const handleGetAllAvatars = async (req, res) => {
  try {
    const result = await avatarService.getAllAvatars();
    return res.success("Fetched all avatars successfully", result);
  } catch (error) {
    return res.error(500, "Failed to fetch avatars", error.message);
  }
};

const handleGetAvatarByUserId = async (req, res) => {
  try {
    const userId = req.params.user_id || req.user?.id;
    const result = await avatarService.getAvatarById(userId);

    if (!result) {
      return res.error(404, "Avatar not found");
    }

    return res.success("Fetched avatar successfully", result);
  } catch (error) {
    return res.error(500, "Failed to fetch avatar", error.message);
  }
};

const handleUpdateAvatar = async (req, res) => {
  try {
    const { file } = req;
    const userId = req.params.user_id || req.user?.id;

    if (!file) {
      return res.error(400, "No file uploaded");
    }

    const result = await avatarService.updateAvatar(userId, file);
    return res.success("Avatar updated successfully", result);
  } catch (error) {
    return res.error(500, "Failed to update avatar", error.message);
  }
};

const handleDeleteAvatar = async (req, res) => {
  try {
    const userId = req.params.user_id || req.user?.id;
    const result = await avatarService.deleteAvatar(userId);

    if (result.error) {
      return res.error(404, result.error);
    }

    return res.success("Avatar deleted successfully", result.message);
  } catch (error) {
    return res.error(500, "Failed to delete avatar", error.message);
  }
};

module.exports = {
  handleUploadAvatar,
  handleGetAllAvatars,
  handleGetAvatarByUserId,
  handleUpdateAvatar,
  handleDeleteAvatar,
};
