const db = require("../models/index.js");
const Task = db.Task;

const createTask = async (data) => {
  try {
    let { title, description, coins } = data;

    if (!title || !description || coins === undefined) {
      throw new Error("Title, description, and coins are required");
    }
    if (typeof coins !== "number" || coins < 0) {
      throw new Error("Coins must be a positive number");
    }

    let result = await Task.create({ title, description, coins });
    return result;
  } catch (e) {
    throw new Error("Failed to create task");
  }
};

const getAllTasks = async () => {
  try {
    return await Task.findAll();
  } catch (e) {
    throw new Error("Failed to fetch tasks");
  }
};

const getTaskById = async (id) => {
  try {
    if (!id) throw new Error("Task ID is required");

    const task = await Task.findByPk(id);
    if (!task) throw new Error("Task not found");

    return task;
  } catch (e) {
    throw new Error("Failed to fetch task");
  }
};

const updateTask = async (id, data) => {
  try {
    if (!id) throw new Error("Task ID is required");

    let { title, description, coins } = data;

    if (!title && !description && coins === undefined) {
      throw new Error(
        "At least one field (title, description, coins) must be provided"
      );
    }

    if (coins !== undefined && (typeof coins !== "number" || coins < 0)) {
      throw new Error("Coins must be a positive number");
    }

    const task = await Task.findByPk(id);
    if (!task) throw new Error("Task not found");

    await task.update({ title, description, coins });
    return task;
  } catch (e) {
    throw new Error("Failed to update task");
  }
};

const deleteTask = async (id) => {
  try {
    if (!id) throw new Error("Task ID is required");

    const task = await Task.findByPk(id);
    if (!task) throw new Error("Task not found");

    await task.destroy();
    return { message: "Task deleted successfully" };
  } catch (e) {
    throw new Error("Failed to delete task");
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
