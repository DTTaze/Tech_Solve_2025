const db = require("../models/index.js");
const TaskSubmit = db.TaskSubmit;
const TaskUser = db.TaskUser;
const Image = db.Image;
const Task = db.Task;
const getTaskSubmitByUserId = async (user_id) => {
  const taskSubmits = await TaskSubmit.findAll({
    include: [
      {
        model: TaskUser,
        as: "task_user",
        where: {
          user_id: user_id,
        },
        include: [
          {
            model: Task,
            as: "tasks",
          },
        ],
      },
      {
        model: Image,
        as: "images",
        where: {
          reference_type: "taskSubmit",
        },
      },
    ],
  });

  const formattedSubmits = taskSubmits.map((submit) => ({
    id: submit.id,
    task_user: {
      progress_count: submit.task_user.progress_count,
      assigned_at: submit.task_user.assigned_at,
      task: {
        id: submit.task_user.tasks.id,
        title: submit.task_user.tasks.title,
        description: submit.task_user.tasks.description,
        coins: submit.task_user.tasks.coins,
        difficulty: submit.task_user.tasks.difficulty,
      },
      user: {
        id: submit.task_user.user_id,
      },
    },
    images: submit.images.map((image) => image.url),
  }));
  return formattedSubmits;
};

const getTaskSubmitByCustomerId = async (customer_id) => {
  const taskSubmits = await TaskSubmit.findAll({
    include: [
      {
        model: TaskUser,
        as: "task_user",
        include: [
          {
            model: Task,
            as: "tasks",
            where: {
              creator_id: customer_id,
            },
          },
        ],
      },
      {
        model: Image,
        as: "images",
        where: {
          reference_type: "taskSubmit",
        },
      },
    ],
  });
  const formattedSubmits = taskSubmits.map((submit) => ({
    id: submit.id,
    task_user: {
      progress_count: submit.task_user.progress_count,
      assigned_at: submit.task_user.assigned_at,
      task: {
        id: submit.task_user.tasks.id,
        title: submit.task_user.tasks.title,
        description: submit.task_user.tasks.description,
        coins: submit.task_user.tasks.coins,
        difficulty: submit.task_user.tasks.difficulty,
      },
      user: {
        id: submit.task_user.user_id,
      },
    },
    images: submit.images.map((image) => image.url),
  }));
  return formattedSubmits;
};

module.exports = {
  getTaskSubmitByUserId,
  getTaskSubmitByCustomerId,
};
