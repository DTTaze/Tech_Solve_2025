const express = require("express");
const taskController = require("../controllers/taskController");
const middlewareImage = require("../middlewares/middlewareImage");

const router = express.Router();

router.post(
  "/upload",
  // checkPermission("post", "task"),
  taskController.handleCreateTask
);
router.get("/", taskController.handleGetAllTasks);
router.get("/:id", taskController.handleGetTask);
router.put(
  "/:id",
  // checkPermission("put", "task_id"),
  taskController.handleUpdateTask
);
router.delete(
  "/:id",
  // checkPermission("delete", "task_id"),
  taskController.handleDeleteTask
);

router.post(
  "/accept/:user_id/:id",
  // checkPermission("accept", "task_id"),
  taskController.handleAcceptTask
);
router.post(
  "/complete/:id",
  // checkPermission("complete", "task_id"),
  taskController.handleCompleteTask
);
router.post(
  "/progress/increase/:task_user_id",
  // checkPermission("progress_count", "task_user_id"),
  taskController.handleIncreaseProgressCount
);
router.post(
  "/submit/:task_user_id",
  middlewareImage.array("images", 5),
  taskController.handleSubmitTask
);
router.put(
  "/submit/decision/:id",
  // checkPermission("delete", "task_id"),
  taskController.handleDecisionTaskSubmit
);
router.post(
  "/coin/receive",
  // checkPermission("delete", "task_id"),
  taskController.handleReceiveCoin
);
router.get("/type/:type_name", taskController.handleGetAllTasksByTypeName);
router.get(
  "/difficulty/:difficulty_name",
  taskController.handleGetAllTasksByDifficultyName
);
module.exports = router;
