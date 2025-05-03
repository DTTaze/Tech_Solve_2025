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
const {redisClient} = require('../config/configRedis.js');
const { get } = require("../routes/authRoutes.js");

const setUserCache = async (user) => {
  await redisClient.set("user:id:" + user.id, JSON.stringify(user), "EX", 60 * 60 * 24);
  await redisClient.set("user:public_id:" + user.public_id, String(user.id), "EX", 60 * 60 * 24);
  await redisClient.set("role:id:" + user.role_id, JSON.stringify(user.roles), "EX", 60 * 60 * 24);
  await redisClient.set("coin:id:" + user.coins_id, JSON.stringify(user.coins), "EX", 60 * 60 * 24);
  await redisClient.set("rank:id:" + user.rank_id, JSON.stringify(user.ranks), "EX", 60 * 60 * 24);
};

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

      let roledata = {};
      const cacheRole = await redisClient.get("role:id:" + role_id);
      if (cacheRole) {
        roledata = JSON.parse(cacheRole);
      } else {
        roledata = await Role.findByPk(role_id);
        if (!roledata) {
          throw new Error("Role does not exist");
        }
        await redisClient.set("role:id:" + role_id, JSON.stringify(roledata), "EX", 60 * 60 * 24); 
      }
      console.log(roledata);

      if (
        roledata.name.toLowerCase() !== "user" &&
        roledata.name.toLowerCase() !== "customer"
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
      coins_id: newCoin.id,
      rank_id: newRank.id,
    });

    // Update rank with user_id after user is created
    await newRank.update({ user_id: newUser.id });

    // Cache the new user, rank, and coin in Redis
    await redisClient.set('user:id:' + newUser.id, JSON.stringify(newUser), 'EX', 60 * 60 * 24);
    await redisClient.set('user:public_id:' + newUser.public_id, String(newUser.id) , 'EX', 60 * 60 * 24);

    await redisClient.set('rank:id' + newRank.id, JSON.stringify(newRank), 'EX', 60 * 60 * 24);
    await redisClient.set('coin:id' + newCoin.id, JSON.stringify(newCoin), 'EX', 60 * 60 * 24);

    return newUser;
  } catch (error) {
    console.error("Error in createUser:", error);
    throw error;
  }
};

const loginUser = async (user, email, password, clientIP, userAgent) => {
  try {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await rateLimitService.recordFailedLogin(
        email,
        clientIP,
        userAgent
      );
      throw new Error("Invalid password");
    }

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
      last_completed_task: user.last_completed_task,
      streak: user.streak,
      avatar_url: user.avatar_url,
    };

    const access_token = jwt.sign(payload, process.env.JWT_AT_SECRET, {
      expiresIn: process.env.JWT_AT_EXPIRE,
    });
    const refresh_token = jwt.sign(payload, process.env.JWT_RF_SECRET, {
      expiresIn: process.env.JWT_RF_EXPIRE,
    });

    await rateLimitService.resetLoginAttempts(
      email,
      clientIP,
      userAgent
    );

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
    await redisClient.del("user:id:" + id);

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
    const user_id = await redisClient.get("user:public_id:" + public_id);
    if (user_id) {
      await redisClient.del("user:id:" + Number(user_id));
    }
    await redisClient.del("user:public_id:" + public_id);

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

const getUserBycacheId = async (id) => {
  try {  
    const cacheUser = await redisClient.get("user:id:" + id);
    console.log("cacheUser", cacheUser);
    if (!cacheUser) return null;
    const data_user = JSON.parse(cacheUser);

    // Retrieve role data from Redis or fallback to database
    let dataRole = JSON.parse(await redisClient.get("role:id:" + data_user.role_id));
    if (!dataRole) {
      dataRole = await Role.findByPk(data_user.role_id, {
        attributes: ["id", "name"],
      });
      if (dataRole) {
        await redisClient.set("role:id:" + data_user.role_id, JSON.stringify(dataRole), "EX", 60 * 60 * 24);
      }
    }

    // Retrieve coin data from Redis or fallback to database
    let dataCoin = JSON.parse(await redisClient.get("coin:id:" + data_user.coins_id));
    if (!dataCoin) {
      dataCoin = await Coin.findByPk(data_user.coins_id, {
        attributes: ["id", "amount"],
      });
      if (dataCoin) {
        await redisClient.set("coin:id:" + data_user.coins_id, JSON.stringify(dataCoin), "EX", 60 * 60 * 24);
      }
    }

    // Retrieve rank data from Redis or fallback to database
    let dataRank = JSON.parse(await redisClient.get("rank:id:" + data_user.rank_id));
    if (!dataRank) {
      dataRank = await Rank.findByPk(data_user.rank_id, {
        attributes: ["id", "amount", "order"],
      });
      if (dataRank) {
        await redisClient.set("rank:id:" + data_user.rank_id, JSON.stringify(dataRank), "EX", 60 * 60 * 24);
      }
    }

    // Construct the user object
    const user = {
      id: data_user.id,
      public_id: data_user.public_id,
      avatar_url: data_user.avatar_url,
      google_id: data_user.google_id,
      email: data_user.email,
      password: data_user.password,
      username: data_user.username,
      full_name: data_user.full_name,
      phone_number: data_user.phone_number,
      address: data_user.address,
      streak: data_user.streak,
      last_completed_task: data_user.last_completed_task,
      roles: dataRole,
      coins: dataCoin,
      ranks: dataRank,
    };
    console.log("user", user);
    return user;
  } catch (e) {
    console.error("Error in getUserBycacheId:", e);
    throw e;
  }
};

const getUserByID = async (id) => {
  try {
    const cacheUser = await getUserBycacheId(id);
    if (cacheUser) return cacheUser;
      
    // Fallback to database query if user data is not in Redis
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
        {
          model: Rank,
          as: "ranks",
          attributes: ["id", "amount", "order"],
        },
      ],
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Cache the user and related data in Redis
    await setUserCache(user);
  
    return user;
  } catch (e) {
    console.error("Error in getUserByID:", e);
    throw e;
  }
};

const getUserByPublicID = async (public_id) => {
  try {
    const cacheUserPublic = await redisClient.get("user:public_id:" + public_id);

    if (cacheUserPublic) {
      const cacheUser = await getUserBycacheId(Number(cacheUserPublic));
      if (cacheUser) return cacheUser;
    }
    
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
        {
          model: Rank,
          as: "ranks",
          attributes: ["id", "amount", "order"],
        },
      ],
    });
    if (!user) {
      throw new Error("User not found");
    }
    
    // Cache the user and related data in Redis
    await setUserCache(user);

    return user;
  } catch (e) {
    throw e;
  }
};

const updateUser = async (user, data) => {
  try {
    let { full_name, address, coins, phone_number, streak } = data;
    data.username
      ? (user.username = data.username)
      : (user.username = user.username);
    data.email ? (user.email = data.email) : (user.email = user.email);

    if (coins !== undefined) {
      let coin = await Coin.findOne({ where: { id: user.coins_id } });
      if (!coin) {
        throw new Error("Coin not found");
      }
      const parsedCoins = Number(coins);
      if (isNaN(parsedCoins) || parsedCoins < 0) {
        throw new Error("Coins must be a non-negative number");
      }
      coin.amount = parsedCoins;
      await coin.save();
      await redisClient.set("coin:id:" + user.coins_id, JSON.stringify(coin), "EX", 60 * 60 * 24);
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

    const roledata = await Role.findByPk(user.role_id);
    if (!roledata) {
      throw new Error("Role does not exist");
    }

    const rankdata = await Rank.findByPk(user.rank_id);
    if (!rankdata) {
      throw new Error("Rank does not exist");
    }

    // Cache the updated user and related data in Redis
    await redisClient.set("user:id:" + user.id, JSON.stringify(user), "EX", 60 * 60 * 24);
    await redisClient.set("user:public_id:" + user.public_id, String(user.id), "EX", 60 * 60 * 24);
    await redisClient.set("role:id:" + user.role_id, JSON.stringify(roledata), "EX", 60 * 60 * 24);
    await redisClient.set("rank:id:" + user.rank_id, JSON.stringify(rankdata), "EX", 60 * 60 * 24);

    return user;
  } catch (e) {
    throw e;
  }
};

const updateUserById = async (id, data) => {
  try {
    let user = await User.findOne({ where: { id: id } });
    if (!user) {
      throw new Error("User not found");
    }
    const updatedUser = await updateUser(user, data);
    return updatedUser;
    
  } catch (e) {
    throw e;
  }
};

const updateUserByPublicID = async (public_id, data) => {
  try {
    let user = await User.findOne({ where: { public_id: public_id } });
    const updatedUser = await updateUser(user, data);
    return updatedUser;
  } catch (e) {
    throw e;
  }
};

const removeSpecialChars = (str) => {
  return str.replace(/[^a-zA-Z0-9\u00C0-\u1EF9\s]/g, " ").trim().replace(/\s+/g, " ");
};

const findOrCreateUser = async (profile) => {
  try {

    const existingUser = await User.findOne({
      where: {
        email: profile.emails[0].value,
      },
    });

    if (existingUser) {
      // Cache the existing user and related data in Redis
      await setUserCache(existingUser);
      return existingUser;
    }

    const newCoin = await Coin.create({ amount: 0 });
    const newRank = await Rank.create({ order: 0 });
    const name = removeSpecialChars(profile.displayName);
    const newUser = await User.create({
      role_id: 2,
      public_id: nanoid(),
      google_id: profile.id,
      email: profile.emails[0].value,
      username: name,
      full_name: name,
      password: null,
      coins_id: newCoin.id,
      rank_id: newRank.id,
    });

    await newRank.update({ user_id: newUser.id });

    // Cache the new user and related data in Redis
    await setUserCache(newUser);
    return newUser;
  } catch (e) {
    throw e;
  }
};

const getAllTasksById = async (id) => {
  try {
    if (!id) {
      throw new Error("User's id cannot be null");
    }
    const cacheAllUserTaskId = await redisClient.get("all:User:taskId:" + id);
    if (cacheAllUserTaskId) {
      let result = [];
      for (const UserTaskId of JSON.parse(cacheAllUserTaskId)) {
        const taskUser = await redisClient.get("taskUser:id:" + UserTaskId);
        if (taskUser) {
          result.push(JSON.parse(taskUser));
        } else {
          const taskUserData = await TaskUser.findOne({
            where: { id: UserTaskId },
            include: [
              {
                model: Task,
                as: "tasks",
                required: true,
              },
            ],
          });
          if (taskUserData) {
            await redisClient.set("taskUser:id:" + UserTaskId, JSON.stringify(taskUserData), "EX", 60 * 60 * 24);
            result.push(taskUserData);
          }
          else {
            throw new Error("TaskUser not found");
          }
        }
      }
      return result;
    };


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

    let litsOfUserTaskId = [];
    for (const taskUser of TaskUsers) {
      litsOfUserTaskId.push(taskUser.id);
    }

    await redisClient.set("all:User:taskId:" + id, JSON.stringify(litsOfUserTaskId), "EX", 60 * 60 * 24);

    return TaskUsers;
  } catch (e) {
    throw e;
  }
};


const getTaskCompleted = async (user_id) => {
  try {
    const allTasksUser = await getAllTasksById(user_id);
    let completedTasks = [];
    for (const taskUser of allTasksUser) {
      let task = await redisClient.get("task:id:" + taskUser.task_id);
      if (task) {
        task = JSON.parse(task);
      }
      else {
        task = await Task.findOne({
          where: { id: taskUser.task_id },
        });
        if (task) {
          await redisClient.set("task:id:" + taskUser.task_id, JSON.stringify(task), "EX", 60 * 60 * 24);
        }else {
          throw new Error("Task not found");
        }
      }
      if (taskUser.progress_count >= task.total_count) {
        completedTasks.push(task);
      }
    }
    return completedTasks;
  } catch (e) {
    throw e;
  }
};


const getItemByIdUser = async (user_id) => {
  try {
    // Check if the list of transaction IDs is cached in Redis
    const cachedTransactionIds = await redisClient.get("all:transaction:user:id" + user_id);
    if (cachedTransactionIds) {
      console.log("cachedTransactionIds", cachedTransactionIds);
      const transactionIds = JSON.parse(cachedTransactionIds);
      const transactions = [];

      // Fetch each transaction by its ID
      for (const transactionId of transactionIds) {
        let transaction = await redisClient.get("transaction:id:" + transactionId);
        if (transaction) {
          transactions.push(JSON.parse(transaction));
        } else {  
          // If not in Redis, fetch from the database
          transaction = await Transaction.findOne({
            where: { id: transactionId },
            attributes: ["id", "total_price", "quantity", "status"],
            include: [
              {
                model: Item,
                attributes: ["id", "name", "description", "price"],
              },
            ],
          });

          if (transaction) {
            // Cache the transaction in Redis
            await redisClient.set(
              "transaction:id:" + transactionId,
              JSON.stringify(transaction),
              "EX",
              60 * 60 * 24
            );
            transactions.push(transaction);
          }
        }
      }
      return transactions;
    }

    // Query the database if the list of transaction IDs is not in the cache
    const items = await Transaction.findAll({
      where: {
        buyer_id: user_id,
        status: ["pending", "completed"],
      },
      attributes: ["id", "total_price", "quantity", "status"],
      include: [
        {
          model: Item,
          as: "item",
          attributes: ["id", "name", "description", "price"],
        },
      ],
    });

    if (!items || items.length === 0) {
      throw new Error("User not found");
    }

    // Cache the list of transaction IDs in Redis
    const transactionIds = items.map((item) => item.id);
    await redisClient.set(
      "all:transaction:user:id" + user_id,
      JSON.stringify(transactionIds),
      "EX",
      60 * 60 * 24
    );

    // Cache each transaction in Redis
    for (const item of items) {
      await redisClient.set(
        "transaction:id:" + item.id,
        JSON.stringify(item),
        "EX",
        60 * 60 * 24
      );
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
  updateUserById,
  findOrCreateUser,
  loginUser,
  getTaskCompleted,
  getAllTasksById,
  getItemByIdUser,
  refreshAccessToken,
};
