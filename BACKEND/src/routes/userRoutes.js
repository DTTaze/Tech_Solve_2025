import express from "express";
import userController from "../controllers/userController";
import checkPermission from "../middlewares/checkPermission";
const router = express.Router();

router.get(
  "/",
  checkPermission("read", "user"),
  userController.handleGetAllUsers
);
router.get("/me", userController.handleGetProfile);
router.get("/:id", userController.handleGetUser);
router.get("/task/completed/:id", userController.handleGetTaskCompleted);
router.put("/:id", userController.handleUpdateUser);
router.delete("/:id", userController.handleDeleteUser);
router.post("/task/all/:id", userController.handleGetAllTaskById);

export default router;
