import express from "express";
import userController from "../controller/userController";

const router = express.Router();

router.get("/", userController.handleUserPage);
router.get("/:id", userController.handleGetUser);
router.put("/:id", userController.handleUpdateUser);
router.delete("/:id", userController.handleDeleteUser);

export default router;
