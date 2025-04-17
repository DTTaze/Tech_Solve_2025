const coinService = require("../services/coinService.js");

const handleGetCoin = async (req, res) => {
  try {
    const id  = req.params.id;
    const coin = await coinService.getCoin(id);
    res.success("Get coin success", coin);
  } catch (error) {
    res.error(500, "Get coin failed", error.message);
  }
};

const handleUpdateCoin = async (req, res) => {
  try {
    const id = req.params.id;
    const coins = req.body.coins;
    const coin = await coinService.updateCoin(id, coins);
    res.success("Update coin success", coin);
  } catch (error) {
    res.error(500, "Update coin failed", error.message);
  }
};

const handleIncreaseCoin = async (req, res) => {
  try {
    const id = req.params.id;
    const coins = req.body.coins;
    const coin = await coinService.updateIncreaseCoin(id, coins);
    res.success("Increase coin success", coin);
  } catch (error) {
    res.error(500, "Increase coin failed", error.message);
  }
};

const handleDecreaseCoin = async (req, res) => {
  try {
    const id = req.params.id;
    const coins = req.body.coins;
    const coin = await coinService.updateDecreaseCoin(id, coins);
    res.success("Decrease coin success", coin);
  } catch (error) {
    res.error(500, "Decrease coin failed", error.message);
  }
};

module.exports = {
  handleGetCoin,
  handleUpdateCoin,
  handleIncreaseCoin,
  handleDecreaseCoin,
};
