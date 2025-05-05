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
const { getCache, setCache, deleteCache } = require("../utils/cache");

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
    const result = await Task.create({
      public_id: nanoid(),
      title,
      content,
      description,
      coins,
      difficulty,
      total,
      creator_id: user_id,
      status: "public",
    });
    const taskData = result.toJSON();
    await setCache(`task:id:${taskData.id}`, taskData);
    await setCache(`task:public_id:${taskData.public_id}`, taskData.id);
    await deleteCache("tasks:all");
    return taskData;
  } catch (e) {
    throw e;
  }
};

const getAllTasks = async () => {
  try {
    let tasks = await getCache("tasks:all");
    if (!tasks) {
      const dbTasks = await Task.findAll({
        include: [{ model: User, attributes: ["id", "username"] }],
      });
      tasks = dbTasks.map((task) => task.toJSON());
      await setCache("tasks:all", tasks);
    }
    return tasks;
  } catch (e) {
    throw e;
  }
};

const getTaskById = async (id) => {
  try {
    if (!id) throw new Error("Task ID is required");
    let task = await getCache(`task:id:${id}`);
    if (!task) {
      const dbTask = await Task.findByPk(id);
      if (!dbTask) throw new Error("Task not found");
      task = dbTask.toJSON();
      await setCache(`task:id:${id}`, task);
    }
    return task;
  } catch (e) {
    throw e;
  }
};

const updateTask = async (id, data) => {
  try {
    if (!id) throw new Error("Task ID is required");
    let { title, content, description, coins, difficulty, total, status } =
      data;
    let updateData = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (description) updateData.description = description;
    if (coins !== undefined) {
      coins = Number(coins);
      if (typeof coins !== "number" || coins < 0) {
        throw new Error("Coins must be a positive number");
      }
      updateData.coins = coins;
    }
    if (difficulty) {
      if (!["easy", "medium", "hard", "event"].includes(difficulty)) {
        throw new Error("Difficulty must be easy/medium/hard");
      }
      updateData.difficulty = difficulty;
    }
    if (total !== undefined) {
      total = Number(total);
      if (typeof total !== "number" || total < 0) {
        throw new Error("Total must be a positive number");
      }
      updateData.total = total;
    }
    if (status) {
      if (!["public", "private"].includes(status)) {
        throw new Error("Status must be public/private");
      }
      updateData.status = status;
    }
    const task = await Task.findByPk(id);
    if (!task) throw new Error("Task not found");
    await task.update(updateData);
    const taskData = task.toJSON();
    await setCache(`task:id:${id}`, taskData);
    await deleteCache("tasks:all");
    return taskData;
  } catch (e) {
    throw e;
  }
};

const deleteTask = async (id) => {
  try {
    if (!id) throw new Error("Task ID is required");
    const task = await Task.findByPk(id);
    if (!task) throw new Error("Task not found");
    const public_id = task.public_id;
    await task.destroy();
    await deleteCache(`task:id:${id}`);
    await deleteCache(`task:public_id:${public_id}`);
    await deleteCache("tasks:all");
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
    const result = await TaskUser.create({ user_id, task_id });
    const taskUserData = result.toJSON();
    await setCache(`taskuser:id:${taskUserData.id}`, taskUserData);
    return taskUserData;
  } catch (e) {
    throw e;
  }
};

const submitTask = async (task_id, user_id, description, files) => {
  try {
    const taskId = Number(task_id);
    const userId = Number(user_id);
    const taskUser = await acceptTask(taskId, userId);
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
    const taskSubmitData = newTaskSubmit.toJSON();
    await setCache(`tasksubmit:id:${taskSubmitData.id}`, taskSubmitData);
    return { taskSubmit: taskSubmitData, images: uploadedImages };
  } catch (error) {
    console.error("Error submitting task:", error.message);
    throw error;
  }
};

const completeTask = async (taskUser, user) => {
  try {
    if (!taskUser || !taskUser.user_id) {
      throw new Error("TaskUser and User ID are required");
    }
    taskUser.status = "done";
    taskUser.completed_at = new Date();
    await taskUser.save();
    const taskUserData = taskUser.toJSON();
    await setCache(`taskuser:id:${taskUserData.id}`, taskUserData);

    let newStreak = user.streak || 0;
    if (user.last_completed_task) {
      let lastCompletedTaskDate = new Date(user.last_completed_task);
      lastCompletedTaskDate.setHours(0, 0, 0, 0);
      let today = new Date();
      today.setHours(0, 0, 0, 0);
      let differenceInDays =
        (today - lastCompletedTaskDate) / (1000 * 60 * 60 * 24);
      if (differenceInDays > 1) {
        newStreak = 1;
      } else if (differenceInDays === 1) {
        newStreak += 1;
      }
    } else {
      newStreak = 1;
    }
    await user.update({
      streak: newStreak,
      last_completed_task: new Date(),
    });
    // User cache assumed to be handled elsewhere
    return;
  } catch (e) {
    throw e;
  }
};

const increaseProgressCount = async (task_user_id) => {
  try {
    if (!task_user_id) throw new Error("Missing task_user_id.");
    const taskUser = await TaskUser.findByPk(task_user_id, {
      include: [{ model: Task, as: "tasks", attributes: ["total", "coins"] }],
    });
    if (!taskUser) throw new Error("Task user not found.");
    if (!taskUser.tasks) throw new Error("Task not found.");
    if (taskUser.progress_count >= taskUser.tasks.total) {
      throw new Error("Task is already completed.");
    }
    taskUser.progress_count = (taskUser.progress_count || 0) + 1;
    if (taskUser.progress_count === taskUser.tasks.total) {
      const user = await User.findByPk(taskUser.user_id);
      if (!user) throw new Error("User not found.");
      await completeTask(taskUser, user);
      const user_coins_id = user.coins_id;
      const coins = taskUser.tasks.coins;
      await coinService.updateIncreaseCoin(user_coins_id, coins);
    }
    await taskUser.save();
    const taskUserData = taskUser.toJSON();
    await setCache(`taskuser:id:${taskUserData.id}`, taskUserData);
    return taskUserData;
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
    taskSubmit.status = decision;
    await taskSubmit.save();
    const taskSubmitData = taskSubmit.toJSON();
    await setCache(`tasksubmit:id:${taskSubmitData.id}`, taskSubmitData);
    if (decision === "approved") {
      await increaseProgressCount(taskSubmit.task_user_id);
    }
    return taskSubmitData;
  } catch (error) {
    console.error("Error updating task submit:", error.message);
    throw error;
  }
};

const getAllTasksByTypeName = async (type_name) => {
  try {
    if (!type_name) throw new Error("Missing type name");
    const cacheKey = `tasks:type:${type_name}`;
    let tasks = await getCache(cacheKey);
    if (!tasks) {
      const type = await Type.findOne({ where: { type: type_name } });
      if (!type) throw new Error("Type not found");
      const taskTypes = await TaskType.findAll({
        where: { type_id: type.id },
        include: [{ model: Task }],
      });
      tasks = taskTypes.map((tt) => tt.Task.toJSON());
      await setCache(cacheKey, tasks, 300); // 5 minutes TTL
    }
    return tasks;
  } catch (error) {
    throw error;
  }
};

const getAllTasksByDifficultyName = async (difficulty_name) => {
  try {
    if (!difficulty_name) throw new Error("Missing difficulty name");
    if (!["easy", "medium", "hard"].includes(difficulty_name)) {
      throw new Error("Difficulty name must be easy/medium/hard");
    }
    const cacheKey = `tasks:difficulty:${difficulty_name}`;
    let tasks = await getCache(cacheKey);
    if (!tasks) {
      const dbTasks = await Task.findAll({
        where: { difficulty: difficulty_name },
      });
      tasks = dbTasks.map((task) => task.toJSON());
      await setCache(cacheKey, tasks, 300);
    }
    return tasks;
  } catch (error) {
    throw error;
  }
};

const getTaskByPublicId = async (public_id) => {
  try {
    if (!public_id) throw new Error("Task Public ID is required");
    const taskId = await getCache(`task:public_id:${public_id}`);
    if (taskId) {
      const task = await getCache(`task:id:${taskId}`);
      if (task) return task;
    }
    const dbTask = await Task.findOne({ where: { public_id } });
    if (!dbTask) throw new Error("Task not found");
    const taskData = dbTask.toJSON();
    await setCache(`task:id:${dbTask.id}`, taskData);
    await setCache(`task:public_id:${public_id}`, dbTask.id);
    return taskData;
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

const getAllTasksStatus = async (status) => {
  if (!status) throw new Error("Status is required");
  if (!["public", "private"].includes(status)) {
    throw new Error("Status must be public/private");
  }
  try {
    const cacheKey = `tasks:status:${status}`;
    let tasks = await getCache(cacheKey);
    if (!tasks) {
      const dbTasks = await Task.findAll({ where: { status } });
      tasks = dbTasks.map((task) => task.toJSON());
      await setCache(cacheKey, tasks, 300);
    }
    return tasks;
  } catch (e) {
    throw e;
  }
};

const getAllTasksStatusPublic = async () => {
  return await getAllTasksStatus("public");
};

const getAllTasksStatusPrivate = async () => {
  return await getAllTasksStatus("private");
};

const getAllTasksOfCustomer = async (customer_id) => {
  try {
    if (!customer_id) throw new Error("Customer ID is required");
    const cacheKey = `tasks:customer:${customer_id}`;
    let tasks = await getCache(cacheKey);
    if (!tasks) {
      const dbTasks = await Task.findAll({
        where: { creator_id: customer_id },
      });
      tasks = dbTasks.map((task) => task.toJSON());
      await setCache(cacheKey, tasks, 300);
    }
    return tasks;
  } catch (e) {
    throw e;
  }
};

const changeTaskStatus = async (task_id, status) => {
  try {
    if (!task_id) throw new Error("Task ID is required");
    if (!status) throw new Error("Status is required");
    if (!["public", "private"].includes(status)) {
      throw new Error("Status must be public/private");
    }
    const task = await Task.findByPk(task_id);
    if (!task) throw new Error("Task not found");
    task.status = status;
    await task.save();
    const taskData = task.toJSON();
    await setCache(`task:id:${task_id}`, taskData);
    await deleteCache("tasks:all");
    return taskData;
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
  getAllTasksStatusPublic,
  getAllTasksStatusPrivate,
  getAllTasksOfCustomer,
  changeTaskStatus,
};