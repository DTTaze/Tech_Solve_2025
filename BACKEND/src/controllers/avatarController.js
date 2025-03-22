const avatarService = require("../services/avatarService");

const handleUploadAvatar = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const { file } = req;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const avatar = await avatarService.uploadAvatar(file,user_id);
    return res.status(201).json(avatar);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

const handleGetAllAvatars = async (req, res) => {
  try {
    const avatars = await avatarService.getAllAvatar();
    return res.status(200).json(avatars);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

const handleGetAvatarById = async (req, res) => {
  try {
    const { user_id } = req.params;
    const avatar = await avatarService.getAvatarById(user_id);
    if (!avatar) {
      return res.status(404).json({ message: "Avatar not found" });
    }
    return res.status(200).json(avatar);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

const handleUpdateAvatar = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { file } = req;
    const avatar = await avatarService.updateAvatar(user_id,file);
    return res.status(200).json(avatar);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

const handleDeleteAvatar = async (req, res) => {
    try {
        const { user_id } = req.params;
        const result = await avatarService.deleteAvatar(user_id);

        if (result.error) {
            return res.status(404).json({ message: result.error });
        }

        return res.status(200).json({ message: result.message });
    } catch (error) {
        console.error("Error in handleDeleteAvatar:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


module.exports = {
    handleUploadAvatar,
    handleGetAllAvatars,
    handleGetAvatarById,
    handleUpdateAvatar,
    handleDeleteAvatar,
};