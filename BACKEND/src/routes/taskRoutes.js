const express = require("express");
const taskController = require("../controllers/taskController");
const middlewareImage = require("../middlewares/middlewareImage");

const router = express.Router();

router.post("/upload", taskController.handleCreateTask);
router.get("/", taskController.handleGetAllTasks);
router.get("/:id", taskController.handleGetTask);
router.put("/:id", taskController.handleUpdateTask);
router.delete("/:id", taskController.handleDeleteTask);

router.post("/accept/:user_id/:id", taskController.handleAcceptTask);
router.post("/complete/:id", taskController.handleCompleteTask);
router.post(
  "/progress/increase/:task_user_id",
  taskController.handleIncreaseProgressCount
);
router.post(
  "/submit/:task_user_id",
  middlewareImage.array("images", 5),
  taskController.handleSubmitTask
);
router.put("/submit/decision/:id", taskController.handleDecisionTaskSubmit);
router.post("/coin/receive", taskController.handleReceiveCoin);
router.get("/type/:type_name", taskController.handleGetAllTasksByTypeName);
router.get(
  "/difficulty/:difficulty_name",
  taskController.handleGetAllTasksByDifficultyName
);
module.exports = router;
