import express from "express";
import userController from "../controller/userController"; // Chưa có itemController nên tạm dùng userController

const router = express.Router();

router.post("/upload", userController.handleLoginUser);
router.get("/", userController.handleUserPage);
router.get("/:id", userController.handleGetUser);
router.put("/:id", userController.handleUpdateUser);
router.delete("/:id", userController.handleDeleteUser);

export default router;
