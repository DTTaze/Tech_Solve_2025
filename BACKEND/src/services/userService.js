require("dotenv").config();
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const db = require("../models/index.js");
const User = db.User;
const Task = db.Task;
const Role = db.Role;
const TaskUser = db.TaskUser;
const Item = db.Item;
const Transaction = db.Transaction;
const Coin = db.Coin;
const Rank = db.Rank;
const salt = bcrypt.genSaltSync(10);
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");
const rateLimitService = require("./rateLimitService");
const createUser = async (data) => {
  try {
    let {
      username,
      full_name,
      role_id,
      email,
      password,
      phone_number,
      address,
    } = data;
    role_id = Number(role_id);
    if (isNaN(role_id)) {
      throw new Error("Invalid Role ID");
    } else {
      const checkRole = await Role.findByPk(role_id);
      if (!checkRole) {
        throw new Error("Role does not exist");
      }
      if (
        checkRole.dataValues.name.toLowerCase() !== "user" &&
        checkRole.dataValues.name.toLowerCase() !== "customer"
      ) {
        throw new Error("Cannot assign this role");
      }
    }
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new Error("Email already exists");
      }
      if (existingUser.username === username) {
        throw new Error("Username already exists");
      }
    }

    let today = new Date();
    today.setHours(0, 0, 0, 0);
    let todayStr = today.toISOString().split("T")[0];

    // Create coin first
    const newCoin = await Coin.create({ amount: 0 });

    // Get the maximum order from existing ranks
    const maxOrderRank = await Rank.findOne({
      order: [["order", "DESC"]],
    });
    const newOrder = maxOrderRank ? maxOrderRank.order + 1 : 1;

    // Create rank with null user_id first
    const newRank = await Rank.create({
      amount: 0,
      order: newOrder,
      user_id: null,
    });

    const hashPassword = bcrypt.hashSync(password, salt);

    // Create user with the new coin and rank IDs
    const newUser = await User.create({
      public_id: nanoid(),
      role_id: role_id,
      email,
      password: hashPassword,
      username,
      full_name,
      phone_number,
      address,
      last_logined: todayStr,
      coins_id: newCoin.id,
      rank_id: newRank.id,
    });

    // Update rank with user_id after user is created
    await newRank.update({ user_id: newUser.id });

    return newUser;
  } catch (error) {
    console.error("Error in createUser:", error);
    throw error;
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
      throw new Error("Invalid email or username");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await rateLimitService.recordFailedLogin(user.email);
      throw new Error("Invalid password");
    }
    await user.update({
      last_logined: todayStr,
    });

    const payload = {
      id: user.id,
      role_id: user.role_id,
      role_name: user.roles?.name,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      phone_number: user.phone_number,
      address: user.address,
      coins_id: user.coins_id,
      last_logined: todayStr,
      streak: user.streak,
      avatar_url: user.avatar_url,
    };
    const access_token = jwt.sign(payload, process.env.JWT_AT_SECRET, {
      expiresIn: process.env.JWT_AT_EXPIRE,
    });
    const refresh_token = jwt.sign(payload, process.env.JWT_RF_SECRET, {
      expiresIn: process.env.JWT_RF_EXPIRE,
    });
    await rateLimitService.resetLoginAttempts(user.email);
    return {
      access_token,
      refresh_token,
      user: payload,
    };
  } catch (e) {
    throw e;
  }
};

const refreshAccessToken = (refreshToken) => {
  if (!refreshToken) {
    throw new Error("No refresh token provided");
  }

  const decoded = jwt.verify(refreshToken, process.env.JWT_RF_SECRET);
  const newAccessToken = jwt.sign(
    { id: decoded.id },
    process.env.JWT_AT_SECRET,
    { expiresIn: process.env.JWT_AT_EXPIRE }
  );

  return newAccessToken;
};

const getAllUsers = async () => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: Role,
          as: "roles",
          attributes: ["id", "name"],
        },
        {
          model: Coin,
          as: "coins",
          attributes: ["id", "amount"],
        },
      ],
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

const deleteUserByPublicID = async (public_id) => {
  try {
    const result = await User.destroy({
      where: { public_id: public_id },
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
    const user = await User.findOne({
      where: { id: id },
      include: [
        {
          model: Role,
          as: "roles",
          attributes: ["id", "name"],
        },
        {
          model: Coin,
          as: "coins",
          attributes: ["id", "amount"],
        },
      ],
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (e) {
    throw e;
  }
};

const getUserByPublicID = async (public_id) => {
  try {
    const user = await User.findOne({
      where: { public_id: public_id },
      include: [
        {
          model: Role,
          as: "roles",
          attributes: ["id", "name"],
        },
        {
          model: Coin,
          as: "coins",
          attributes: ["id", "amount"],
        },
      ],
    });
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
    let { full_name, address, coins, phone_number, streak } = data;
    let user = await User.findOne({ where: { id: id } });
    if (!user) {
      throw new Error("User not found");
    }
    data.username
      ? (user.username = data.username)
      : (user.username = user.username);
    data.email ? (user.email = data.email) : (user.email = user.email);

    if (coins !== undefined) {
      const parsedCoins = Number(coins);
      if (isNaN(parsedCoins) || parsedCoins < 0) {
        throw new Error("Coins must be a non-negative number");
      }
      user.coins = parsedCoins;
    }

    if (streak !== undefined) {
      const parsedStreak = Number(streak);
      if (isNaN(parsedStreak) || parsedStreak < 0) {
        throw new Error("Streak must be a non-negative number");
      }
      user.streak = parsedStreak;
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

const updateUserByPublicID = async (public_id, data) => {
  try {
    let { full_name, address, phone_number, streak } = data;
    let user = await User.findOne({ where: { public_id: public_id } });
    if (!user) {
      throw new Error("User not found");
    }
    data.username
      ? (user.username = data.username)
      : (user.username = user.username);
    data.email ? (user.email = data.email) : (user.email = user.email);

    if (streak !== undefined) {
      const parsedStreak = Number(streak);
      if (isNaN(parsedStreak) || parsedStreak < 0) {
        throw new Error("Streak must be a non-negative number");
      }
      user.streak = parsedStreak;
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
    const existingUser = await User.findOne({
      where: {
        email: profile.emails[0].value,
      },
    });

    if (existingUser) {
      return existingUser;
    }

    const newCoin = await Coin.create({ amount: 0 });
    const newRank = await Rank.create({ order: 0 });
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    let todayStr = today.toISOString().split("T")[0];

    const newUser = await User.create({
      role_id: 2,
      public_id: nanoid(),
      google_id: profile.id,
      email: profile.emails[0].value,
      username: profile.displayName,
      full_name: profile.displayName,
      password: null,
      last_logined: todayStr,
      coins_id: newCoin.id,
      rank_id: newRank.id,
    });

    await newRank.update({ user_id: newUser.id });

    return newUser;
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

const getAllTasksById = async (id) => {
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
  getUserByPublicID,
  updateUserByPublicID,
  deleteUserByPublicID,
  updateUser,
  findOrCreateUser,
  loginUser,
  getTaskCompleted,
  getAllTasksById,
  getItemByIdUser,
  refreshAccessToken,
};
