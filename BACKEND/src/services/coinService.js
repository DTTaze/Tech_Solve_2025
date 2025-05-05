const db = require("../models/index");
const Coin = db.Coin;
const { getCache, setCache } = require("../utils/cache");

const getCoin = async (id) => {
  try {
    const cacheCoin = await getCache(`coin:id:${id}`);
    if (cacheCoin) {
      console.log("Cache hit for coin", id);
      return cacheCoin;
    }
    const coin = await Coin.findByPk(id);
    if (!coin) {
      throw new Error("Coin not found");
    }
    await setCache(`coin:id:${id}`, coin, 60 * 60);
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
    await setCache(`coin:id:${id}`, coin, 60 * 60);
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
    await setCache(`coin:id:${id}`, coin, 60 * 60);
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
      throw new Error("Coin amount cannot be decreased below 0");
    }
    await coin.save();
    await setCache(`coin:id:${id}`, coin, 60 * 60);
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
