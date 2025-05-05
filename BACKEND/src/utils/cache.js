const { redisClient } = require("../config/configRedis");
const DEFAULT_TTL = 60 * 60;

const getCache = async (key) => {
  try {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  } catch (err) {
    console.error("Redis GET error:", err);
    return null;
  }
};

const setCache = async (key, data, ttl = DEFAULT_TTL) => {
  try {
    await redisClient.set(key, JSON.stringify(data), "EX", ttl);
  } catch (err) {
    console.error("Redis SET error:", err);
  }
};

const deleteCache = async (key) => {
  try {
    await redisClient.del(key);
  } catch (err) {
    console.error("Redis DEL error:", err);
  }
};

module.exports = {
  getCache,
  setCache,
  deleteCache,
};
