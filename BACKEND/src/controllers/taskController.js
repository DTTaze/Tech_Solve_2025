const taskService = require("../services/taskService");
const taskSubmitService = require("../services/taskSubmitService.js");

const handleGetAllTasks = async (req, res) => {
  try {
    let result = await taskService.getAllTasks();
    return res.success("Get list of tasks success", result);
  } catch (error) {
    return res.error(500, "Failed to fetch list of tasks", error.message);
  }
};

const handleCreateTask = async (req, res) => {
  try {
    const user_id = req.user.id;
    let result = await taskService.createTask(req.body, user_id);
    return res.success("Create task success", result);
  } catch (error) {
    return res.error(500, "Failed to create task in controller", error.message);
  }
};

const handleDeleteTask = async (req, res) => {
  try {
    let result = await taskService.deleteTask(req.params.id);
    return res.success("Delete task success", result);
  } catch (error) {
    return res.error(500, "Failed to delete task", error.message);
  }
};

const handleGetTask = async (req, res) => {
  try {
    let result = await taskService.getTaskById(req.params.id);
    return res.success("Get task success", result);
  } catch (error) {
    return res.error(500, "Failed to get task", error.message);
  }
};

const handleUpdateTask = async (req, res) => {
  try {
    let result = await taskService.updateTask(req.params.id, req.body);
    return res.success("Update task success", result);
  } catch (error) {
    return res.error(500, "Failed to update task", error.message);
  }
};

const handleAcceptTask = async (req, res) => {
  try {
    const task_id = req.params.id;
    const user_id = req.user.id;
    let result = await taskService.acceptTask(task_id, user_id);
    return res.success("Accept task success", result);
  } catch (error) {
    return res.error(500, "Failed to accept task", error.message);
  }
};

const handleSubmitTask = async (req, res) => {
  try {
    const task_id = req.params.task_id;
    const user_id = req.user.id;
    const description = req.body.description;
    description = description ? String(description) : "";

    const files = req.files;

    let result = await taskService.submitTask(
      task_id,
      user_id,
      description,
      files
    );

    return res.success("Submit task success", result);
  } catch (error) {
    return res.error(500, "Failed to submit task", error.message);
  }
};

const handleDecisionTaskSubmit = async (req, res) => {
  try {
    const task_submit_id = req.params.id;
    const decision = req.body.decision;
    let result = await taskService.updateDecisionTaskSubmit(
      task_submit_id,
      decision
    );
    return res.success("Approved task submit success", result);
  } catch (error) {
    return res.error(500, "Failed to update task submit", error.message);
  }
};

const handleIncreaseProgressCount = async (req, res) => {
  try {
    const task_user_id = req.params.task_user_id;
    let result = await taskService.increaseProgressCount(task_user_id);
    return res.success("Increase progress count success", result);
  } catch (error) {
    return res.error(500, "Failed to increase progress count", error.message);
  }
};

const handleGetAllTasksByTypeName = async (req, res) => {
  try {
    const type_name = req.params.type_name;
    let result = await taskService.getAllTasksByTypeName(type_name);
    return res.success("Get task by type name success", result);
  } catch (error) {
    return res.error(500, "Failed to get task by type name", error.message);
  }
};

const handleGetAllTasksByDifficultyName = async (req, res) => {
  try {
    const difficulty_name = req.params.difficulty_name;
    let result = await taskService.getAllTasksByDifficultyName(difficulty_name);
    return res.success("Get task by difficulty name success", result);
  } catch (error) {
    return res.error(
      500,
      "Failed to get task by difficulty name",
      error.message
    );
  }
};

const handleGetTaskByPublicId = async (req, res) => {
  try {
    let result = await taskService.getTaskByPublicId(req.params.public_id);
    return res.success("Get task by public ID success", result);
  } catch (error) {
    return res.error(500, "Failed to get task by public ID", error.message);
  }
};

const handleUpdateTaskByPublicId = async (req, res) => {
  try {
    let result = await taskService.updateTaskByPublicId(
      req.params.public_id,
      req.body
    );
    return res.success("Update task success", result);
  } catch (error) {
    return res.error(500, "Failed to update task", error.message);
  }
};

const handleDeleteTaskByPublicId = async (req, res) => {
  try {
    let result = await taskService.deleteTaskByPublicId(req.params.public_id);
    return res.success("Delete task success", result);
  } catch (error) {
    return res.error(500, "Failed to delete task", error.message);
  }
};

const handleGetTaskSubmitByUserId = async (req,res) => {
  try {
    const user_id = req.params.user_id;
    let result = await taskSubmitService.getTaskSubmitByUserId(user_id);
    return res.success("Get task submit by user id success", result);
  } catch (error) {
    return res.error(500, "Failed to get task submit by user id", error.message);
  }
};

const handleGetTaskSubmitByCustomerId = async (req,res) => {
  try {
    const customer_id = req.params.customer_id;
    let result = await taskSubmitService.getTaskSubmitByCustomerId(customer_id);
    return res.success("Get task submit by customer id success", result);
  } catch (error) {
    return res.error(500, "Failed to get task submit by customer id", error.message);
  }
}
module.exports = {
  handleGetAllTasks,
  handleCreateTask,
  handleDeleteTask,
  handleGetTask,
  handleUpdateTask,
  handleAcceptTask,
  handleSubmitTask,
  handleDecisionTaskSubmit,
  handleIncreaseProgressCount,
  handleGetAllTasksByTypeName,
  handleGetAllTasksByDifficultyName,
  handleGetTaskByPublicId,
  handleUpdateTaskByPublicId,
  handleDeleteTaskByPublicId,
  handleGetTaskSubmitByUserId,
  handleGetTaskSubmitByCustomerId,
};
