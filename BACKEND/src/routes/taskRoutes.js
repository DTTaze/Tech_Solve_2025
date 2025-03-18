import express from "express";
const taskController = require("../controllers/taskController");

const router = express.Router();

router.post("/upload", taskController.handleCreateTask);
router.get("/", taskController.handleGetAllTasks);
router.get("/:id", taskController.handleGetTask);
router.put("/:id", taskController.handleUpdateTask);
router.delete("/:id", taskController.handleDeleteTask);

export default router;
