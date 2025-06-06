const db = require("../models/index");
const ReceiverInformation = db.ReceiverInformation;
const { getCache, setCache, deleteCache } = require("../utils/cache");

const KEY_PREFIX = "receiverInformation:id:";

// CREATE
const createReceiverInfo = async (data) => {
  try {
    const {
      user_id,
      to_name,
      to_phone,
      to_address,
      to_ward_name,
      to_district_name,
      to_province_name,
      account_type = "home",
      is_default = false,
    } = data;

    if (
      !user_id ||
      !to_name ||
      !to_phone ||
      !to_address ||
      !to_ward_name ||
      !to_district_name ||
      !to_province_name
    ) {
      throw new Error("Missing required fields");
    }

    const validAccountTypes = ["home", "office"];
    if (!validAccountTypes.includes(account_type)) {
      throw new Error("Invalid account_type. Must be 'home' or 'office'");
    }

    const newReceiverInfo = await ReceiverInformation.create({
      user_id,
      to_name,
      to_phone,
      to_address,
      to_ward_name,
      to_district_name,
      to_province_name,
      account_type,
      is_default,
    });

    await setCache(`${KEY_PREFIX}${newReceiverInfo.id}`, newReceiverInfo);
    await deleteCache("receiverInfo:all");

    return newReceiverInfo;
  } catch (error) {
    console.error("Error create Receiver Info:", error.message);
    throw error;
  }
};

// READ
const getReceiverInfoById = async (id) => {
  try {
    const cacheKey = `${KEY_PREFIX}${id}`;
    let receiverInfo = await getCache(cacheKey);

    if (receiverInfo) {
      return receiverInfo;
    }

    receiverInfo = await ReceiverInformation.findByPk(id);
    if (receiverInfo) {
      setCache(cacheKey, receiverInfo);
    }else throw new error(`ReceiverInformation ${id} not found`);

    return receiverInfo;
  } catch (error) {
    console.error("Error get Receiver Info:", error.message);
    throw error;
  }
};

const getAllReceiverInfo = async () => {
  try {
    const cachedReceiverIds = await getCache(`receiverInfo:all`);
    if (cachedReceiverIds) {
      console.log("cachedReceiverIds", cachedReceiverIds);
      const receivers = [];
      for (const receiverId of cachedReceiverIds) {
        const receiver = await getReceiverInfoById(receiverId);
        if (receiver) {
          receivers.push(receiver);
        }
      }
      return receivers;
    }

    const receiverRecords = await ReceiverInformation.findAll();
    const receiverList = [];
    const receiverIds = [];

    for (const receiver of receiverRecords) {
      const receiverData = receiver.toJSON();
      receiverIds.push(receiverData.id);

      // Optionally, cache each individual receiver
      const cacheKey = `${KEY_PREFIX}${receiverData.id}`;
      await setCache(cacheKey, receiverData);
    }

    // Cache the list of all receiver IDs
    await setCache(`receiverInfo:all`, receiverIds);

    return receiverRecords;
  } catch (error) {
    console.error("Error retrieving receiver info:", error);
    throw error;
  }
};

const getReceiverInfoByUserId = async (user_id) => {
  try {
    const allInfo = await getAllReceiverInfo();

    // Filter the list by user_id
    const userReceivers = allInfo.filter(item => item.user_id === user_id);

    return userReceivers;
  } catch (error) {
    console.error("Error getting Receiver Info by user_id:", error.message);
    throw error;
  }
};


// UPDATE
const updateReceiverInfoById = async (id, data) => {
  try {
    const receiverInfo = await ReceiverInformation.findByPk(id);
    if (!receiverInfo) {
      throw new Error(`Receiver Info not found by id: ${id}`);
    }

    // Danh sách các trường hợp lệ có thể cập nhật
    const updatableFields = [
      "to_name",
      "to_phone",
      "to_address",
      "to_ward_name",
      "to_district_name",
      "to_province_name",
      "account_type",
      "is_default",
    ];

    // Lọc ra các trường được truyền và hợp lệ
    const updateData = {};
    for (const key of updatableFields) {
      if (data.hasOwnProperty(key)) {
        updateData[key] = data[key];
      }
    }

    // Nếu không có trường hợp lệ nào thì không làm gì
    if (Object.keys(updateData).length === 0) {
      throw new Error("No valid fields provided for update");
    }

    await receiverInfo.update(updateData);
    const updated = await ReceiverInformation.findByPk(id);

    // delete cache
    await deleteCache(`${KEY_PREFIX}${id}`);
    await deleteCache("receiverInfo:all")
    return updated;
  } catch (error) {
    console.error("Error update Receiver Info:", error.message);
    throw error;
  }
};

const setDefaultReceiverInfoById = async (id) => {
  try {
    const info = await ReceiverInformation.findOne({
      where: { id },
    });
    if (!info)
      throw new Error("Receiver information not found");

    const user_id = info.user_id;

    const allAccounts = await ReceiverInformation.findAll({
      where: { user_id },
      attributes: ['id'],
    });

    await ReceiverInformation.update(
      { is_default: false },
      { where: { user_id } }
    );

    await info.update({ is_default: true });

    await Promise.all(
      allAccounts.map(acc => deleteCache(`${KEY_PREFIX}${acc.id}`))
    );

    await deleteCache(`receiverInfo:all`);

    return info;
  } catch (err) {
    throw err;
  }
};


// DELETE
const deleteReceiverInfoById = async (id) => {
  try {
    const deletedCount = await ReceiverInformation.destroy({
      where: { id },
    });

    if (deletedCount > 0) {
      await deleteCache(`${KEY_PREFIX}${id}`);
      await deleteCache("receiverInfo:all")
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error delete Receiver Info:", error.message);
    throw error;
  }
};

module.exports = {
  createReceiverInfo,
  getReceiverInfoById,
  getReceiverInfoByUserId,
  updateReceiverInfoById,
  setDefaultReceiverInfoById,
  deleteReceiverInfoById,
};
