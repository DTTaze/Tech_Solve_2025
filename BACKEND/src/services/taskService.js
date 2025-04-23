const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const { Readable } = require("stream");
const db = require("../models/index.js");
const Task = db.Task;
const TaskUser = db.TaskUser;
const User = db.User;
const TaskSubmit = db.TaskSubmit;
const TaskType = db.TaskType;
const Type = db.Type;
const uploadImages = require("./imageService.js").uploadImages;
const coinService = require("./coinService.js");
const { nanoid } = require("nanoid");

const createTask = async (data, user_id) => {
  try {
    let { title, content, description, coins, difficulty, total } = data;
    coins = Number(coins);
    total = Number(total);
    if (
      !user_id ||
      !title ||
      !content ||
      !description ||
      coins === undefined ||
      !["easy", "medium", "hard"].includes(difficulty)
    ) {
      throw new Error("user_id, title, description, and coins are required");
    }
    if (typeof coins !== "number" || coins < 0) {
      throw new Error("Coins must be a positive number");
    }
    if (typeof total !== "number" || total < 0) {
      throw new Error("Total must be a positive number");
    }
    let result = await Task.create({
      public_id: nanoid(),
      title,
      content,
      description,
      coins,
      difficulty,
      total,
      owner_id: user_id,
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
    task_id = Number(task_id);
    user_id = Number(user_id);
    if (!Number.isInteger(task_id) || !Number.isInteger(user_id)) {
      throw new Error("Task ID and User ID must be integers");
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


const submitTask = async (task_id,user_id, description, files) => {
  try {
    const taskId = Number(task_id);
    const userId = Number(user_id);
    const taskUser = await acceptTask(taskId, userId);
    console.log("Files:", files);

    if (!files || files.length === 0) throw new Error("No files provided.");

    const newTaskSubmit = await TaskSubmit.create({
      task_user_id: taskUser.id,
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

const completeTask = async (taskUser) => {
  try {
    if (!taskUser || !taskUser.user_id) {
      throw new Error("TaskUser and User ID are required");
    }
    taskUser.status = "done";
    taskUser.completed_at = new Date();
    await taskUser.save();

    const user = await User.findByPk(taskUser.user_id);
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

      await completeTask(taskUser);

      const user = await User.findByPk(taskUser.user_id);
      if (!user) throw new Error("User not found.");
      const user_coins_id = user.coins_id;
      const coins = taskUser.tasks.coins;
      await coinService.updateIncreaseCoin(user_coins_id, coins);

      // taskUser.completed_at = new Date();

      // const user = await User.findByPk(taskUser.user_id);
      // if (!user) throw new Error("User not found.");

      // const user_coins_id = user.coins_id;
      // const coins = taskUser.tasks.coins;

      // const increaseCoin = await receiveCoin(user_coins_id, coins);
      // if (increaseCoin.error) {
      //   throw new Error("Failed to increase coins.");
      // }
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

const getTaskByPublicId = async (public_id) => {
  try {
    if (!public_id) throw new Error("Task Public ID is required");

    const task = await Task.findOne({ where: { public_id } });
    if (!task) throw new Error("Task not found");

    return task;
  } catch (e) {
    throw e;
  }
};

const updateTaskByPublicId = async (public_id, data) => {
  try {
    if (!public_id) throw new Error("Task Public ID is required");

    const task = await Task.findOne({ where: { public_id } });
    if (!task) throw new Error("Task not found");

    return await updateTask(task.id, data);
  } catch (e) {
    throw e;
  }
};

const deleteTaskByPublicId = async (public_id) => {
  try {
    if (!public_id) throw new Error("Task Public ID is required");

    const task = await Task.findOne({ where: { public_id } });
    if (!task) throw new Error("Task not found");

    return await deleteTask(task.id);
  } catch (e) {
    throw e;
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
  submitTask,
  updateDecisionTaskSubmit,
  increaseProgressCount,
  getAllTasksByTypeName,
  getAllTasksByDifficultyName,
  getTaskByPublicId,
  updateTaskByPublicId,
  deleteTaskByPublicId,
};
