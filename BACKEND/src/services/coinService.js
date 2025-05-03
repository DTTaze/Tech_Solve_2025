const db = require("../models/index");
const Coin = db.Coin;
const { redisClient } = require("../config/configRedis");

const getCoin = async (id) => {
  try {
    const cacheCoin = await redisClient.get(`coin:id:${id}`);
    if (cacheCoin) {
      console.log("cacheCoin", cacheCoin);
      return JSON.parse(cacheCoin);
    }
    const coin = await Coin.findByPk(id);
    if (!coin) {
      throw new Error("Coin not found");
    }
    await redisClient.set(`coin:id:${id}`, JSON.stringify(coin), 'EX', 60 * 60 );
    return coin;
  } catch (error) {
    throw error;
  }
};

const updateCoin = async (id, coins) => {
  try {
    const coin = await Coin.findByPk(id);
    if (!coin) {
      throw new Error("Coin not found");
    }
    await coin.update({ amount: coins });
    await redisClient.set(`coin:id:${id}`, JSON.stringify(coin), 'EX', 60 * 60 );
    return coin;
  } catch (error) {
    throw error;
  }
};

const updateIncreaseCoin = async (id, coins) => {
  try {
    const coin = await Coin.findByPk(id);
    if (!coin) {
      throw new Error("Coin not found");
    }
    coin.amount += coins;
    await coin.save();
    await redisClient.set(`coin:id:${id}`, JSON.stringify(coin), 'EX', 60 * 60 );
    return coin;
  } catch (error) {
    throw error;
  }
};

const updateDecreaseCoin = async (id, coins) => {
  try {
    const coin = await Coin.findByPk(id);
    if (!coin) {
      throw new Error("Coin not found");
    }
    coin.amount -= coins;
    if (coin.amount < 0) {
      throw new Error("Coin amount cannot be decrease");
    }
    await coin.save();
    await redisClient.set(`coin:id:${id}`, JSON.stringify(coin), 'EX', 60 * 60 );
    return coin;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getCoin,
  updateCoin,
  updateIncreaseCoin,
  updateDecreaseCoin,
};
