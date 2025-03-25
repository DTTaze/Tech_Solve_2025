import express from "express";
const taskController = require("../controllers/taskController");
const middlewareImage = require("../middlewares/middlewareImage");

const router = express.Router();

router.post("/upload", taskController.handleCreateTask);
router.get("/", taskController.handleGetAllTasks);
router.get("/:id", taskController.handleGetTask);
router.put("/:id", taskController.handleUpdateTask);
router.delete("/:id", taskController.handleDeleteTask);

router.post("/accept/:id", taskController.handleAcceptTask);
router.post("/complete/:id", taskController.handleCompleteTask);

router.post("/submit/:task_user_id",middlewareImage.single("image"), taskController.handleSubmitTask);
router.put("/submit/approve/:id", taskController.handleUpdateTaskSubmit);
router.post("/coin/receive", taskController.handleReceiveCoin);
export default router;
