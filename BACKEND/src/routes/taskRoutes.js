import express from "express";
import taskController from "../controller/taskController"; // Chưa có taskController nên tạm dùng userController

const router = express.Router();

router.post("/upload", taskController.handleCreateTask);
router.get("/", taskController.handleGetAllTasks);
router.get("/:id", taskController.handleGetTask);
router.put("/:id", taskController.handleUpdateTask);
router.delete("/:id", taskController.handleDeleteTask);

export default router;
