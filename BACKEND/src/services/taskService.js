const axios = require("axios");
const FormData = require("form-data"); 
const fs = require("fs");
const { Readable } = require("stream");
const db = require("../models/index.js");
const Task = db.Task;
const TaskUser = db.TaskUser;
const User = db.User;
const TaskSubmit = db.TaskSubmit;

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

const receiveCoin = async (user_id, coins) => {
  try {
    if (!user_id) throw new Error("User ID is required");
    if (!Number.isInteger(coins) || coins <= 0)
      throw new Error("Coins must be a positive integer");

    const user = await User.findByPk(user_id);
    if (!user) throw new Error("User not found");

    user.coins = (user.coins || 0) + coins;
    await user.save();

    return { message: `Successfully received ${coins} coins.` };
  } catch (e) {
    throw e;
  }
};

const downloadImage = async (url) => {
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream", 
  });
  return response.data;
};

const submitTask = async (task_user_id, description, file, auth) => {
  try {
    console.log("file:", file);
    if (!task_user_id) throw new Error("Missing task_user_id.");
    if (!auth) throw new Error("Missing auth.");
    if (!file || !file.path) throw new Error("Invalid file object.",file);

    const newTaskSubmit = await TaskSubmit.create({
      task_user_id: task_user_id,
      description: description || "",
      images_id: null,
      status: "pending",
      submitted_at: new Date(),
    });

    const imageStream = await downloadImage(file.path);

    const formData = new FormData();
    formData.append("image", imageStream, file.originalname);
    formData.append("reference_id", newTaskSubmit.id);
    formData.append("reference_type", "taskSubmit");

    const uploadResponse = await axios.post(
      "http://localhost:6060/api/images/upload",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          authorization: auth,
        },
      }
    );


    if (!uploadResponse.data.data || !uploadResponse.data.data.id) {
      throw new Error("Image upload response is invalid.");
    }

    await newTaskSubmit.update({ images_id: uploadResponse.data.data.id });

    return uploadResponse.data.data;
  } catch (error) {
    console.error("Error submitting task:", error.message);
    throw error;
  }
};

const updateDecisionTaskSubmit = async (task_submit_id,decision) => {
  try {
    if (!task_submit_id) throw new Error("Missing task_submit_id.");
    if (!decision) throw new Error("Missing decision.");
    if (!["approved", "rejected"].includes(decision)) {
      throw new Error("Decision must be either 'approved' or 'rejected'.");
    }
    const taskSubmit = await TaskSubmit.findByPk(task_submit_id);
    if (!taskSubmit) throw new Error("Task submit not found.");

    taskSubmit.status = decision;
    await taskSubmit.save();

    if (decision === "approved") {
      const taskUser = await TaskUser.findByPk(taskSubmit.task_user_id);
      if (!taskUser) throw new Error("Task user not found.");
      taskUser.completed_at = new Date();
      taskUser.status = "done";
      taskUser.completed_at = new Date();
      await taskUser.save();
      
      const user = await User.findByPk(taskUser.user_id);
      if (!user) throw new Error("User not found.");
      user.coins = (user.coins || 0) + taskUser.coins_per_user;
      await user.save();
    }
    if (decision === "rejected") {
      const taskUser = await TaskUser.findByPk(taskSubmit.task_user_id);
      if (!taskUser) throw new Error("Task user not found.");
      taskUser.status = "inProgress";
    }
    return taskSubmit;
  } catch (error) {
    console.error("Error updating task submit:", error.message);
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
};
