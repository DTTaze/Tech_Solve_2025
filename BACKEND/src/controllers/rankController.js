const rankService = require("../services/rankService.js");

const handleGetRankById = async (req, res) => {
  try {
    const rank_id = req.params.id;
    const rank = await rankService.getRankById(rank_id);
    return res.success("Get rank success", rank);
  } catch (error) {
    return res.error(500, "Failed to get rank", error.message);
  }
};

const handleRearrangeRanks = async (req, res) => {
  try {
    const result = await rankService.rearrangeRanks();
    res.success("Rearrange ranks success", result);
  } catch (error) {
    res.error(500, "Failed to rearrange ranks", error.message);
  }
};

module.exports = {
  handleGetRankById,
  handleRearrangeRanks
};
