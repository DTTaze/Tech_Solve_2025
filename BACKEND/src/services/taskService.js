const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const { Readable } = require("stream");
const db = require("../models/index.js");
const e = require("express");
const Task = db.Task;
const TaskUser = db.TaskUser;
const User = db.User;
const TaskSubmit = db.TaskSubmit;
const TaskType = db.TaskType;
const Type = db.Type;
const Coin = db.Coin;
const uploadImages = require("./imageService.js").uploadImages;

const createTask = async (data) => {
  try {
    let { title, content, description, coins, difficulty, total } = data;
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
    if (typeof total !== "number" || total < 0) {
      throw new Error("Total must be a positive number");
    }
    let result = await Task.create({
      title,
      content,
      description,
      coins,
      difficulty,
      total,
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
    throw e;
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

    let { title, content, description, coins, difficulty, total } = data;
    coins = Number(coins);
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

    await task.update({
      title,
      content,
      description,
      coins,
      difficulty,
      total,
    });
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

    const result = await TaskUser.create({
      user_id,
      task_id,
    });

    return result;
  } catch (e) {
    throw e;
  }
};

const completeTask = async (task_id, user_id) => {
  try {
    if (!task_id || !user_id) {
      throw new Error("Task ID and User ID are required");
    }

    const taskUser = await TaskUser.findOne({
      where: { task_id, user_id },
    });
    if (!taskUser) throw new Error("Task not found");
    taskUser.status = "done";
    taskUser.completed_at = new Date();
    await taskUser.save();
    const user = await User.findByPk(user_id);
    if (!user) throw new Error("User not found");

    let newStreak = user.streak || 0;
    if (user.last_logined) {
      let lastLogin = new Date(user.last_logined);
      lastLogin.setHours(0, 0, 0, 0);

      let today = new Date();
      today.setHours(0, 0, 0, 0);
      let yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate());

      let todayStr = today.toISOString().split("T")[0];
      let lastLoginStr = lastLogin.toISOString().split("T")[0];
      let yesterdayStr = yesterday.toISOString().split("T")[0];

      if (lastLoginStr === todayStr) {
        return;
      } else if (lastLoginStr === yesterdayStr) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }
    }
    await user.update({
      streak: newStreak,
    });
  } catch (e) {
    throw e;
  }
};

const receiveCoin = async (user_coins_id, coins) => {
  try {
    if (!user_coins_id || !coins) {
      throw new Error("User ID and coins are required");
    }

    user_coins_id = Number(user_coins_id);
    if (!Number.isInteger(user_coins_id)) {
      throw new Error("Invalid user_coins_id. It must be an integer.");
    }

    coins = Number(coins);
    if (!Number.isInteger(coins) || coins <= 0) {
      throw new Error("Coins must be a positive integer");
    }

    const user_coins = await Coin.findByPk(user_coins_id);
    if (!user_coins) throw new Error("Coin record not found");

    user_coins.amount = (user_coins.amount || 0) + coins;
    await user_coins.save();

    return { message: `Successfully received ${coins} coins.` };
  } catch (e) {
    throw e;
  }
};

const submitTask = async (task_user_id, description, files) => {
  try {
    task_user_id = Number(task_user_id);

    if (!Number.isInteger(task_user_id)) {
      throw new Error("Invalid task_user_id. It must be an integer.");
    }

    console.log("Files:", files);

    if (!task_user_id) throw new Error("Missing task_user_id.");
    if (!files || files.length === 0) throw new Error("No files provided.");

    const newTaskSubmit = await TaskSubmit.create({
      task_user_id: task_user_id,
      description: description || "",
      status: "pending",
      submitted_at: new Date(),
    });

    const uploadedImages = await uploadImages(
      files,
      newTaskSubmit.id,
      "taskSubmit"
    );

    return { taskSubmit: newTaskSubmit, images: uploadedImages };
  } catch (error) {
    console.error("Error submitting task:", error.message);
    throw error;
  }
};

const increaseProgressCount = async (task_user_id) => {
  try {
    if (!task_user_id) throw new Error("Missing task_user_id.");

    const taskUser = await TaskUser.findByPk(task_user_id, {
      include: [
        {
          model: Task,
          as: "tasks",
          attributes: ["total", "coins"],
        },
      ],
    });

    if (!taskUser) throw new Error("Task user not found.");
    if (!taskUser.tasks) throw new Error("Task not found.");

    if (taskUser.progress_count >= taskUser.tasks.total) {
      throw new Error("Task is already completed.");
    }

    taskUser.progress_count = (taskUser.progress_count || 0) + 1;

    if (taskUser.progress_count === taskUser.tasks.total) {
      taskUser.completed_at = new Date();

      const user = await User.findByPk(taskUser.user_id);
      if (!user) throw new Error("User not found.");

      const user_coins_id = user.coins_id;
      const coins = taskUser.tasks.coins;

      const increaseCoin = await receiveCoin(user_coins_id, coins);
      if (increaseCoin.error) {
        throw new Error("Failed to increase coins.");
      }
    }

    await taskUser.save();

    return taskUser;
  } catch (error) {
    console.error("Error increasing progress count:", error.message);
    throw error;
  }
};

const updateDecisionTaskSubmit = async (task_submit_id, decision) => {
  try {
    if (!task_submit_id) throw new Error("Missing task_submit_id.");
    if (!decision) throw new Error("Missing decision.");
    if (!["approved", "rejected"].includes(decision)) {
      throw new Error("Decision must be either 'approved' or 'rejected'.");
    }

    const taskSubmit = await TaskSubmit.findByPk(task_submit_id);
    if (!taskSubmit) throw new Error("Task submit not found.");

    // Update taskSubmit status
    taskSubmit.status = decision;
    await taskSubmit.save();

    if (decision === "approved") {
      increaseProgressCount(taskSubmit.task_user_id);
    }

    if (decision === "rejected") {
      taskUser.status = "inProgress";
      await taskUser.save();
    }

    return taskSubmit;
  } catch (error) {
    console.error("Error updating task submit:", error.message);
    throw error;
  }
};

const getAllTasksByTypeName = async (type_name) => {
  try {
    if (!type_name) throw new Error("Missing type name");
    const type = await Type.findOne({
      where: { type: type_name },
    });
    if (!type) {
      throw new Error("Type is not existed");
    }
    const tasks = await TaskType.findAll({
      where: { type_id: type.id },
      include: [
        {
          model: Task,
        },
      ],
    });
    if (!tasks) throw new Error("Failed to get task by type name");
    return tasks;
  } catch (error) {
    throw error;
  }
};

const getAllTasksByDifficultyName = async (difficulty_name) => {
  try {
    if (!difficulty_name) throw new Error("Missing difficulty name");
    else if (
      difficulty_name !== "easy" &&
      difficulty_name !== "medium" &&
      difficulty_name !== "hard"
    ) {
      throw new Error("Difficulty name must be easy/medium/hard");
    }
    const tasks = await Task.findAll({
      where: { difficulty: difficulty_name },
    });
    if (!tasks) throw new Error("Failed to get task by difficulty name");
    return tasks;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  acceptTask,
  completeTask,
  receiveCoin,
  submitTask,
  updateDecisionTaskSubmit,
  increaseProgressCount,
  getAllTasksByTypeName,
  getAllTasksByDifficultyName,
};
