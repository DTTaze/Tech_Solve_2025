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

    setCache(`${KEY_PREFIX}${newReceiverInfo.id}`, newReceiverInfo);
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
    }

    return receiverInfo;
  } catch (error) {
    console.error("Error get Receiver Info:", error.message);
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
    delete(`${KEY_PREFIX}${id}`);
    return updated;
  } catch (error) {
    console.error("Error update Receiver Info:", error.message);
    throw error;
  }
};


// DELETE
const deleteReceiverInfoById = async (id) => {
  try {
    const deletedCount = await ReceiverInformation.destroy({
      where: { id },
    });

    if (deletedCount > 0) {
      deleteCache(`${KEY_PREFIX}${id}`);
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
  updateReceiverInfoById,
  deleteReceiverInfoById,
};
