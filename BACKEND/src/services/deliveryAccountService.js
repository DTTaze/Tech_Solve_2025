const db = require("../models");
const DeliveryAccount = db.DeliveryAccount;
const { getCache, setCache, deleteCache } = require("../utils/cache");

const getAllDeliveryAccounts = async (userId) => {
  try {
    const cacheKey = `delivery:user:${userId}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      console.log("Cache hit for delivery accounts of user", userId);
      return cached;
    }

    const accounts = await DeliveryAccount.findAll({
      where: { user_id: userId },
    });
    await setCache(cacheKey, accounts, 60 * 60);
    return accounts;
  } catch (err) {
    throw err;
  }
};

const getDeliveryAccountById = async (id) => {
  try {
    const cacheKey = `delivery:id:${id}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      console.log("Cache hit for delivery account", id);
      return cached;
    }

    const account = await DeliveryAccount.findByPk(id);
    if (!account) throw new Error("Delivery account not found");

    await setCache(cacheKey, account, 60 * 60);
    return account;
  } catch (err) {
    throw err;
  }
};

const createDeliveryAccount = async (data) => {
  try {
    const account = await DeliveryAccount.create(data);
    await deleteCache(`delivery:user:${data.user_id}`);
    return account;
  } catch (err) {
    throw err;
  }
};

const updateDeliveryAccount = async (id, data) => {
  try {
    const account = await DeliveryAccount.findByPk(id);
    if (!account) throw new Error("Delivery account not found");

    await account.update(data);
    await deleteCache(`delivery:id:${id}`);
    await deleteCache(`delivery:user:${account.user_id}`);
    return account;
  } catch (err) {
    throw err;
  }
};

const deleteDeliveryAccount = async (id) => {
  try {
    const account = await DeliveryAccount.findByPk(id);
    if (!account) throw new Error("Delivery account not found");

    await account.destroy();
    await deleteCache(`delivery:id:${id}`);
    await deleteCache(`delivery:user:${account.user_id}`);
    return { message: "Deleted successfully" };
  } catch (err) {
    throw err;
  }
};

const setDefaultDeliveryAccount = async (id) => {
  try {
    const account = await DeliveryAccount.findOne({
      where: { id },
    });
    if (!account)
      throw new Error("Delivery account not found or not owned by user");

    await DeliveryAccount.update(
      { is_default: false },
      { where: { user_id: account.user_id } }
    );

    const allAccounts = await DeliveryAccount.findAll({
      where: { user_id: account.user_id },
      attributes: ['id'], 
    });

    await account.update({ is_default: true });

    for (const acc of allAccounts) {
      await deleteCache(`delivery:id:${acc.id}`);
    }

    await deleteCache(`delivery:user:${account.user_id}`);

    return account;
  } catch (err) {
    throw err;
  }
};


module.exports = {
  getAllDeliveryAccounts,
  getDeliveryAccountById,
  createDeliveryAccount,
  updateDeliveryAccount,
  deleteDeliveryAccount,
  setDefaultDeliveryAccount,
};
