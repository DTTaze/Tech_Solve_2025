const express = require("express");
const avatarController = require("../controllers/avatarController");
const middlewareAvatar = require("../middlewares/middlewareAvatar");
const router = express.Router();

router.post(
    "/upload", 
    middlewareAvatar.single("avatar"),
    avatarController.handleUploadAvatar);
router.get("/getall", avatarController.handleGetAllAvatars);
router.get("/get", avatarController.handleGetAvatarById);
router.put(
    "/update",
    middlewareAvatar.single("avatar"),
    avatarController.handleUpdateAvatar);
router.delete("/delete", avatarController.handleDeleteAvatar);

export default router;