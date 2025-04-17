const db = require("../models/index");
const Coin = db.Coin;

const getCoin = async (id) => {
  try {
    const coin = await Coin.findByPk(id);
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
    coin.coins = coins;
    await coin.save();
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
