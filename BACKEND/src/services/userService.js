require("dotenv").config();
import bcrypt from "bcryptjs";
const { Op } = require("sequelize");
const db = require("../models/index.js");
const User = db.User;
const Task = db.Task;
const Role = db.Role;
const TaskUser = db.TaskUser;
const Item = db.Item;
const Transaction = db.Transaction;
const salt = bcrypt.genSaltSync(10);
const jwt = require("jsonwebtoken");

const createUser = async (data) => {
  try {
    let { email, password, username, full_name, phone_number, address } = data;
    const user = await User.findOne({ where: { email: email } });
    if (user) {
      throw new Error("User already exists");
    }
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    let todayStr = today.toISOString().split("T")[0];
    const hashPassword = bcrypt.hashSync(password, salt);
    const newUser = await User.create({
      email: email,
      password: hashPassword,
      username: username,
      full_name: full_name,
      phone_number: phone_number,
      address: address,
      last_logined: todayStr,
    });
    return newUser;
  } catch (e) {
    throw e;
  }
};

const loginUser = async (data) => {
  try {
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    let todayStr = today.toISOString().split("T")[0];

    let { username, email, password } = data;
    if (!email && !username) {
      throw new Error("Vui lòng cung cấp email hoặc username");
    }
    let condition = email ? { email } : { username };
    const user = await User.findOne({
      where: condition,
      include: [
        {
          model: Role,
          as: "roles",
          attributes: ["id", "name"],
        },
      ],
    });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }
    await user.update({
      last_logined: todayStr,
    });
    // Create an access token
    const payload = {
      id: user.id,
      role_id: user.role_id,
      role_name: user.roles?.name,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      phone_number: user.phone_number,
      address: user.address,
      coins: user.coins,
      last_logined: todayStr,
      streak: user.streak,
      avatar_url: user.avatar_url,
    };
    const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    return {
      access_token,
      user: payload,
    };
  } catch (e) {
    throw e;
  }
};

const getAllUsers = async () => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });
    return users;
  } catch (e) {
    throw e;
  }
};

const deleteUser = async (id) => {
  try {
    const result = await User.destroy({
      where: { id: id },
    });

    if (result === 0) {
      throw new Error("User not found");
    }

    return { message: "User deleted successfully" };
  } catch (e) {
    throw e;
  }
};

const getUserByID = async (id) => {
  try {
    const user = await User.findOne({ where: { id: id } });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (e) {
    throw e;
  }
};

const updateUser = async (id, data) => {
  try {
    let { full_name, address, phone_number, coins, streak } = data;
    let user = await User.findOne({ where: { id: id } });
    if (!user) {
      throw new Error("User not found");
    }
    data.username
      ? (user.username = data.username)
      : (user.username = user.username);
    data.email ? (user.email = data.email) : (user.email = user.email);
    if (coins === undefined) {
      user.coins = user.coins;
    } else {
      if (coins < 0) {
        throw new Error("Coins must be possitive");
      } else {
        user.coins = Number(coins);
      }
    }
    if (streak === undefined) {
      user.streak = user.streak;
    } else {
      if (streak < 0) {
        throw new Error("Streak must be possitive");
      } else {
        user.streak = Number(streak);
      }
    }
    full_name
      ? (user.full_name = full_name)
      : (user.full_name = user.full_name);
    address ? (user.address = address) : (user.address = user.address);
    phone_number
      ? (user.phone_number = phone_number)
      : (user.phone_number = user.phone_number);
    user.username == ""
      ? (user.username = username)
      : (user.username = user.username);
    user.email == "" ? (user.email = email) : (user.email = user.email);
    await user.save();

    return user;
  } catch (e) {
    throw e;
  }
};

const findOrCreateUser = async (profile) => {
  try {
    const [user] = await User.findOrCreate({
      where: {
        [Op.or]: [{ email: profile.emails[0].value }, { googleId: profile.id }],
      },
      defaults: {
        googleId: profile.id,
        email: profile.emails[0].value,
        username: profile.displayName,
        password: null,
      },
    });

    return user;
  } catch (e) {
    throw e;
  }
};

const getTaskCompleted = async (id) => {
  try {
    const user = await User.findOne({ where: { id: id } });
    if (!user) {
      throw new Error("User not found");
    }

    const TaskUsers = await TaskUser.findAll({
      where: { user_id: id },
      include: [
        {
          model: Task,
          as: "tasks",
          required: true,
          where: { total: { [Op.ne]: null } },
        },
      ],
    });

    const completedTasks = TaskUsers.filter(
      (taskUser) => taskUser.progress_count >= taskUser.tasks.total
    );

    return completedTasks;
  } catch (e) {
    throw e;
  }
};

const getAllTaskById = async (id) => {
  try {
    const user = await User.findAll({ where: { id: id } });
    if (!user) {
      throw new Error("User not found");
    }

    const TaskUsers = await TaskUser.findAll({
      where: { user_id: id },
      include: [
        {
          model: Task,
          as: "tasks",
          required: true,
        },
      ],
    });

    return TaskUsers;
  } catch (e) {
    throw e;
  }
};

const getItemByIdUser = async (user_id) => {
  try {
    const items = await Transaction.findAll({
      where: {
        buyer_id: user_id,
        status: ["pending", "completed"], 
      },
      attributes: ["id", "total_price", "quantity", "status"],
      include: [
        {
          model: Item, 
          attributes: ["id", "name", "description", "price"],
        },
      ],
    });

    if (!items || items.length === 0) {
      throw new Error("User not found");
    }

    return items;
  } catch (e) {
    throw e;
  }
};


module.exports = {
  createUser,
  getAllUsers,
  deleteUser,
  getUserByID,
  updateUser,
  findOrCreateUser,
  loginUser,
  getTaskCompleted,
  getAllTaskById,
  getItemByIdUser,
};
