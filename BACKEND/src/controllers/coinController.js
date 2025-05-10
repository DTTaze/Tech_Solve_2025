const coinService = require("../services/coinService.js");
const { getCache, setCache, deleteCache } = require("../utils/cache");

const cacheKeyCoin = (id) => `coin:id:${id}`;

const handleGetCoin = async (req, res) => {
  try {
    const id = req.params.id;
    const cacheKey = cacheKeyCoin(id);

    const cached = await getCache(cacheKey);
    if (cached) {
      const coin = JSON.parse(cached);
      return res.success("Get coin success (from cache)", coin);
    }

    const coin = await coinService.getCoin(id);
    await setCache(cacheKey, JSON.stringify(coin));
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

    await deleteCache(cacheKeyCoin(id));

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

    await deleteCache(cacheKeyCoin(id));

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

    await deleteCache(cacheKeyCoin(id));

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
