const taskService = require("../services/taskService");

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
    let result = await taskService.createTask(req.body);
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


const handleCompleteTask = async (req, res) => {
  try {
    const task_id = req.params.id;
    const user_id = req.user.id; 
    let result = await taskService.completeTask(task_id, user_id);
    return res.success("Complete task success", result);
  } catch (error) {
    return res.error(500, "Failed to complete task", error.message);
  }
};

const handleReceiveCoin = async (req, res) => {
  try {
    const user_id = req.user.id;
    const coins = Number(req.body.coins);
    let result = await taskService.receiveCoin(user_id, coins);
    return res.success("Recieve coin success", result);
  } catch (error) {
    return res.error(500, "Failed to recieve coin", error.message);
  }
};

module.exports = {
  handleGetAllTasks,
  handleCreateTask,
  handleDeleteTask,
  handleGetTask,
  handleUpdateTask,
  handleAcceptTask,
  handleCompleteTask,
  handleReceiveCoin
};
