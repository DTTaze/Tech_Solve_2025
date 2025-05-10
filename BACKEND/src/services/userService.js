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
const { getCache, setCache, deleteCache } = require("../utils/cache");

const deleteCacheAll = async(id = null,public_id = null)=> {
  if (public_id){
    await deleteCache(`user:public_id:${public_id}`);
  }
  if (id){
    await deleteCache(`user:id:${id}`);
  }
  await deleteCache()
}

const removeSpecialChars = (str) => {
  return str
    .replace(/[^a-zA-Z0-9\u00C0-\u1EF9\s]/g, " ")
    .trim()
    .replace(/\s+/g, " ");
};

const setUserCache = async (user) => {
  const userData =
    typeof user.toJSON === "function" ? user.toJSON() : { ...user };
  delete userData.password;
  await setCache(`user:id:${userData.id}`, userData);
  await setCache(`user:public_id:${userData.public_id}`, String(userData.id));

  if (userData.roles) {
    await setCache(`role:id:${userData.role_id}`, userData.roles);
  }
  if (userData.coins) {
    await setCache(`coin:id:${userData.coins_id}`, userData.coins);
  }
  if (userData.ranks) {
    await setCache(`rank:id:${userData.rank_id}`, userData.ranks);
  }
};

const createUser = async (data) => {
  try {
    let { username, full_name, role_id, email, password } = data;

    role_id = Number(role_id);

    if (isNaN(role_id)) throw new Error("Invalid Role ID");

    let roledata = await getCache(`role:id:${role_id}`);
    if (!roledata) {
      roledata = await Role.findByPk(role_id);
      if (!roledata) throw new Error("Role does not exist");
      await setCache(`role:id:${role_id}`, roledata);
    }
    if (!["user", "customer"].includes(roledata.name.toLowerCase())) {
      throw new Error("Cannot assign this role");
    }

    const existingUser = await User.findOne({
      where: { [Op.or]: [{ email }, { username }] },
    });
    if (existingUser) {
      if (existingUser.email === email) throw new Error("Email already exists");
      if (existingUser.username === username)
        throw new Error("Username already exists");
    }

    const hashPassword = bcrypt.hashSync(password, salt);

    const newUser = await User.create({
      public_id: nanoid(),
      role_id,
      email,
      password: hashPassword,
      username,
      full_name,
    });

    const newCoin = await Coin.create({
      amount: 0,
      user_id: newUser.id,
    });
    const maxOrderRank = await Rank.findOne({ order: [["order", "DESC"]] });
    const newOrder = maxOrderRank ? maxOrderRank.order + 1 : 1;
    const newRank = await Rank.create({
      amount: 0,
      order: newOrder,
      user_id: newUser.id,
    });

    const userWithIncludes = {
      ...newUser.toJSON(),
      roles: roledata,
      coins: newCoin,
      ranks: newRank,
    };
    await setUserCache(userWithIncludes);

    //delete password
    delete newUser.password;
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
      await rateLimitService.recordFailedLogin(email, clientIP, userAgent);
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

    await rateLimitService.resetLoginAttempts(email, clientIP, userAgent);

    return { access_token, refresh_token, user: payload };
  } catch (e) {
    throw e;
  }
};

const refreshAccessToken = (refreshToken) => {
  if (!refreshToken) throw new Error("No refresh token provided");
  const decoded = jwt.verify(refreshToken, process.env.JWT_RF_SECRET);
  return jwt.sign({ id: decoded.id }, process.env.JWT_AT_SECRET, {
    expiresIn: process.env.JWT_AT_EXPIRE,
  });
};

const getAllUsers = async () => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      include: [
        { model: Role, as: "roles", attributes: ["id", "name"] },
        { model: Coin, as: "coins", attributes: ["id", "amount"] },
      ],
    });
    return users;
  } catch (e) {
    throw e;
  }
};

const deleteUser = async (id) => {
  try {
    const user = await User.findOne({ where: { id } });
    if (!user) throw new Error("User not found");

    await deleteCache(`user:id:${id}`);
    await deleteCache(`user:public_id:${user.public_id}`);

    const rankDestroyed = await Rank.destroy({ where: { id: user.rank_id } });
    if (rankDestroyed === 0) throw new Error("Rank not found");

    const coinDestroyed = await Coin.destroy({ where: { id: user.coins_id } });
    if (coinDestroyed === 0) throw new Error("Coin not found");

    const userDestroyed = await User.destroy({ where: { id: user.id } });
    if (userDestroyed === 0) throw new Error("User not found");

    return { message: "User deleted successfully" };
  } catch (e) {
    throw e;
  }
};

const deleteUserByPublicID = async (public_id) => {
  try {
    const user_id = await getCache(`user:public_id:${public_id}`);
    if (user_id) await deleteCache(`user:id:${Number(user_id)}`);
    await deleteCache(`user:public_id:${public_id}`);

    const user = await User.findOne({ where: { public_id } });
    if (!user) throw new Error("User not found");

    const rankDestroyed = await Rank.destroy({ where: { id: user.rank_id } });
    if (rankDestroyed === 0) throw new Error("Rank not found");

    const coinDestroyed = await Coin.destroy({ where: { id: user.coins_id } });
    if (coinDestroyed === 0) throw new Error("Coin not found");

    const result = await User.destroy({ where: { id: user.id } });
    if (result === 0) throw new Error("User not found");

    return { message: "User deleted successfully" };
  } catch (e) {
    throw e;
  }
};

const getUserBycacheId = async (id) => {
  try {
    const cacheUser = await getCache(`user:id:${id}`);
    if (!cacheUser) return null;

    const data_user = cacheUser;
    console.log("cacheUser:", cacheUser);

    // Role
    let dataRole = await getCache(`role:id:${data_user.role_id}`);
    if (!dataRole) {
      dataRole = await Role.findByPk(data_user.role_id, {
        attributes: ["id", "name"],
      });
      if (dataRole) await setCache(`role:id:${data_user.role_id}`, dataRole);
    }
    if (!dataRole)
      throw new Error(`Role not found for role_id ${data_user.role_id}`);

    // Coin
    let dataCoin = await getCache(`coin:id:${data_user.coin_id}`);
    if (!dataCoin) {
      dataCoin = await Coin.findByPk(data_user.coin_id, {
        attributes: ["id", "amount"],
      });
      if (dataCoin) await setCache(`coin:id:${data_user.coin_id}`, dataCoin);
    }
    if (!dataCoin)
      throw new Error(`Coin not found for coin_id ${data_user.coin_id}`);

    // Rank
    let dataRank = await getCache(`rank:id:${data_user.rank_id}`);
    if (!dataRank) {
      dataRank = await Rank.findByPk(data_user.rank_id, {
        attributes: ["id", "amount", "order"],
      });
      if (dataRank) await setCache(`rank:id:${data_user.rank_id}`, dataRank);
    }
    if (!dataRank)
      throw new Error(`Rank not found for rank_id ${data_user.rank_id}`);

    const user = {
      id: data_user.id,
      public_id: data_user.public_id,
      avatar_url: data_user.avatar_url,
      google_id: data_user.google_id,
      email: data_user.email,
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

    const user = await User.findOne({
      where: { id },
      attributes: { exclude: ["password"] },
      include: [
        { model: Role, as: "roles", attributes: ["id", "name"] },
        { model: Coin, as: "coins", attributes: ["id", "amount"] },
        { model: Rank, as: "ranks", attributes: ["id", "amount", "order"] },
      ],
    });
    if (!user) throw new Error("User not found");
    delete user.password;
    const userFormat = {
      ...user.toJSON(),
      role_id: user.roles?.id || null,
      coin_id: user.coins?.id || null,
      rank_id: user.ranks?.id || null,
    };
    delete userFormat.roles;
    delete userFormat.coins;
    delete userFormat.ranks;
    await setUserCache(userFormat);
    return user;
  } catch (e) {
    console.error("Error in getUserByID:", e);
    throw e;
  }
};

const getUserByPublicID = async (public_id) => {
  try {
    const cacheUserPublic = await getCache(`user:public_id:${public_id}`);
    if (cacheUserPublic) {
      const cacheUser = await getUserBycacheId(Number(cacheUserPublic));
      if (cacheUser) return cacheUser;
    }

    const user = await User.findOne({
      where: { public_id },
      attributes: { exclude: ["password"] },
      include: [
        { model: Role, as: "roles", attributes: ["id", "name"] },
        { model: Coin, as: "coins", attributes: ["id", "amount"] },
        { model: Rank, as: "ranks", attributes: ["id", "amount", "order"] },
      ],
    });
    if (!user) throw new Error("User not found");

    await setUserCache(user);
    return user;
  } catch (e) {
    throw e;
  }
};


const updateUser = async (user, data) => {
  try {
    let { full_name, username, phone_number, email } = data;

    if (username !== undefined) {
      username = removeSpecialChars(username);
      user.username = username;
    }

    if (email !== undefined) {
      const existingUser = await User.findOne({
        where: {
          email,
          id: { [Op.ne]: user.id }, 
        },
      });
      if (existingUser) {
        throw new Error("Email is already used by another user");
      }
      user.email = email;
    }

    if (full_name !== undefined) {
      full_name = removeSpecialChars(full_name);
      user.full_name = full_name;
    }

    if (phone_number !== undefined) {
      user.phone_number = phone_number;
    }

    await user.save();

    const user_id = user.id;

    const coindata = await Coin.findOne({ where: { user_id } });
    if (!coindata) throw new Error("Coin does not exist");

    const roledata = await Role.findOne({ where: { user_id } });
    if (!roledata) throw new Error("Role does not exist");

    const rankdata = await Rank.findOne({ where: { user_id } });
    if (!rankdata) throw new Error("Rank does not exist");

    const updatedUser = {
      ...user.toJSON(),
      coins: coindata,
      roles: roledata,
      ranks: rankdata,
    };

    await deleteCacheAll(user.id, user.public_id);
    return user;
  } catch (e) {
    throw e;
  }
};


const updateUserById = async (id, data) => {
  try {
    let user = await User.findOne({ where: { id } });
    if (!user) throw new Error("User not found");
    return await updateUser(user, data);
  } catch (e) {
    throw e;
  }
};

const updateUserByPublicID = async (public_id, data) => {
  try {
    const user = await User.findOne({ where: { public_id } });
    if (!user) throw new Error("User not found");

    const { full_name, username, email, phone_number } = data;

    if (username !== undefined) user.username = username;
    if (email !== undefined) user.email = email;
    if (full_name !== undefined) user.full_name = full_name;
    if (phone_number !== undefined) user.phone_number = phone_number;

    await user.save();

    const [roledata, rankdata, coin] = await Promise.all([
      Role.findByPk(user.role_id),
      Rank.findByPk(user.rank_id),
      Coin.findByPk(user.coins_id),
    ]);

    if (!roledata) throw new Error("Role does not exist");
    if (!rankdata) throw new Error("Rank does not exist");

    const updatedUser = {
      ...user.toJSON(),
      roles: roledata,
      coins: coin,
      ranks: rankdata,
    };

    await deleteCacheAll(user.id, user.public_id);
    return user;
  } catch (e) {
    throw e;
  }
};

const findOrCreateUser = async (profile) => {
  try {
    const existingUser = await User.findOne({
      where: { email: profile.emails[0].value },
      include: [
        { model: Role, as: "roles" },
        { model: Coin, as: "coins" },
        { model: Rank, as: "ranks" },
      ],
    });

    if (existingUser) {
      await setUserCache(existingUser);
      return existingUser;
    }

    const name = removeSpecialChars(profile.displayName);
    const newUser = await User.create({
      role_id: 2,
      public_id: nanoid(),
      google_id: profile.id,
      email: profile.emails[0].value,
      username: name,
      full_name: name,
      password: null,
    });

    const newCoin = await Coin.create({
      amount: 0,
      user_id: newUser.id,
    });
    const maxOrderRank = await Rank.findOne({ order: [["order", "DESC"]] });
    const newOrder = maxOrderRank ? maxOrderRank.order + 1 : 1;
    const newRank = await Rank.create({
      amount: 0,
      order: newOrder,
      user_id: newUser.id,
    });

    const userWithIncludes = {
      ...newUser.toJSON(),
      roles: roledata,
      coins: newCoin,
      ranks: newRank,
    };
    await deleteCacheAll(newUser.id, newUser.public_id);

    //delete password
    delete newUser.password;
    return newUser;
  } catch (e) {
    throw e;
  }
};

const getAllTasksById = async (user_id) => {
  try {
    if (!user_id) throw new Error("User ID is required");

    const cacheKey = `all:User:taskId:${user_id}`;
    const taskUserIds = await getCache(cacheKey);
    const result = [];

    if (Array.isArray(taskUserIds) && taskUserIds.length > 0) {
      for (const id of taskUserIds) {
        let taskUser = await getCache(`taskUser:id:${id}`);
        if (!taskUser) {
          taskUser = await TaskUser.findOne({
            where: { id },
            include: [{ model: Task, as: "tasks", required: true }],
          });
          if (taskUser) await setCache(`taskUser:id:${id}`, taskUser);
        }
        if (taskUser) result.push(taskUser);
      }

      return result;
    }

    const taskUsers = await TaskUser.findAll({
      where: { user_id },
      include: [{ model: Task, as: "tasks", required: true }],
    });

    const ids = taskUsers.map((t) => t.id);
    await setCache(cacheKey, ids);
    for (const t of taskUsers) {
      await setCache(`taskUser:id:${t.id}`, t);
    }

    return taskUsers;
  } catch (err) {
    throw err;
  }
};

const getTaskCompleted = async (user_id) => {
  try {
    const allTasksUser = await getAllTasksById(user_id);
    console.log(
      `check all tasks user: ${JSON.stringify(allTasksUser, null, 2)}`
    );

    if (!Array.isArray(allTasksUser) || allTasksUser.length === 0) {
      console.log(`No tasks found for user_id: ${user_id}`);
      return [];
    }

    let completedTasks = [];

    for (const taskUser of allTasksUser) {
      let task = await getCache(`task:id:${taskUser.task_id}`);

      if (!task) {
        // Nếu không có trong cache thì lấy từ DB và cache lại
        task = await Task.findOne({ where: { id: taskUser.task_id } });

        if (task) {
          task = task.toJSON(); // Sequelize instance => plain object
          await setCache(`task:id:${taskUser.task_id}`, task); // Đã stringify trong setCache
        } else {
          console.log(`Task not found for task_id: ${taskUser.task_id}`);
          continue;
        }
      }

      // task đã được parse sẵn từ getCache nên không cần JSON.parse
      console.log(`Task details: ${JSON.stringify(task, null, 2)}`);

      const progress = Number(taskUser.progress_count) || 0;
      const total = Number(task.total) || 0; // Đảm bảo field đúng

      console.log(`Progress: ${progress}, Total: ${total}`);

      if (progress >= total && total > 0) {
        completedTasks.push(task);
      }
    }

    console.log(`Completed tasks: ${JSON.stringify(completedTasks, null, 2)}`);
    return completedTasks;
  } catch (e) {
    console.error(`Error in getTaskCompleted: ${e.message}`);
    throw e;
  }
};

const getItemByIdUser = async (user_id) => {
  try {
    const cachedTransactionIds = await getCache(
      `all:transaction:user:id${user_id}`
    );
    if (cachedTransactionIds) {
      const transactions = [];
      for (const transactionId of cachedTransactionIds) {
        let transaction = await getCache(`transaction:id:${transactionId}`);
        if (!transaction) {
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
          if (transaction)
            await setCache(`transaction:id:${transactionId}`, transaction);
        }
        if (transaction) transactions.push(transaction);
      }
      return transactions;
    }

    const items = await Transaction.findAll({
      where: { buyer_id: user_id, status: ["pending", "completed"] },
      attributes: ["id", "total_price", "quantity", "status"],
      include: [
        {
          model: Item,
          as: "item",
          attributes: ["id", "name", "description", "price"],
        },
      ],
    });
    if (!items || items.length === 0) throw new Error("User not found");

    const transactionIds = items.map((item) => item.id);
    await setCache(`all:transaction:user:id${user_id}`, transactionIds);
    for (const item of items) {
      await setCache(`transaction:id:${item.id}`, item);
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
