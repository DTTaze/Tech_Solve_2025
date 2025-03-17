const express = require("express");
const avatarController = require("../controllers/avatarController");
const middlewareAvatar = require("../middlewares/middlewareAvatar");
const router = express.Router();

router.post(
    "/upload/:idUser", 
    middlewareAvatar.single("avatar"),
    avatarController.handleUploadAvatar);
router.get("/", avatarController.handleGetAllAvatars);
router.get("/:id", avatarController.handleGetAvatarById);
router.put(
    "/:id",
    middlewareAvatar.single("avatar"),
    avatarController.handleUpdateAvatar);
router.delete("/:id", avatarController.handleDeleteAvatar);

export default router;