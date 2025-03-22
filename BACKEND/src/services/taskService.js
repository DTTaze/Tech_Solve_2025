const db = require("../models/index.js");
const Task = db.Task;
const TaskUser = db.TaskUser;
const User = db.User;

const createTask = async (data) => {
  try {
    let { title, content, description, coins, difficulty } = data;
    coins = Number(coins);
    if (
      !title ||
      !content ||
      !description ||
      coins === undefined ||
      !["easy", "medium", "hard"].includes(difficulty)
    ) {
      throw new Error("Title, description, and coins are required");
    }
    if (typeof coins !== "number" || coins < 0) {
      throw new Error("Coins must be a positive number");
    }

    let result = await Task.create({
      title,
      content,
      description,
      coins,
      difficulty,
    });
    return result;
  } catch (e) {
    throw e;
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
    throw e;
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
    throw e;
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
    throw e;
  }
};

const acceptTask = async (task_id, user_id) => {
  try {
    if (!task_id || !user_id) {
      throw new Error("Task ID and User ID are required");
    }

    const task = await Task.findByPk(task_id);
    if (!task) throw new Error("Task not found");

    const user = await User.findByPk(user_id);
    if (!user) throw new Error("User not found");

    await TaskUser.create({
      task_id,
      user_id,
      status: "pending",
      coins_per_user: task.coins,
    });

    return { message: "Task accepted successfully" };
  } catch (e) {
    throw e;
  }
}

const completeTask = async (task_id, user_id) => {
  try {
    if (!task_id || !user_id) {
      throw new Error("Task ID and User ID are required");
    }

    const taskUser = await TaskUser.findOne({
      where: { task_id, user_id },
    });
    taskUser.status = "done";
    taskUser.completed_at = new Date();
    await taskUser.save();
    if (!taskUser) throw new Error("Task not found");
  } catch (e) {
    throw e;
  }
}

const receiveCoin = async (user_id,coins) => {
  try {
    if (!user_id) {
      throw new Error("User ID is required");
    }

    const user = await User.findByPk(user_id);
    if (!user) throw new Error("User not found");

    user.coins += coins;
    await user.save();
    return { message: "Successfully received {coins} coins." };
  } catch (e) {
    throw e;
  }
}
  

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  acceptTask,
  completeTask,
  receiveCoin,
};
