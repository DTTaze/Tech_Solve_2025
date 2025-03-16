import express from "express";
import userController from "../controllers/userController";

const router = express.Router();

router.get("/", userController.handleGetAllUsers);
router.get("/me", userController.handleGetProfile);
router.get("/:id", userController.handleGetUser);
router.put("/:id", userController.handleUpdateUser);
router.delete("/:id", userController.handleDeleteUser);

export default router;
