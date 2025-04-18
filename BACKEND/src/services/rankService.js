const db = require("../models/index");
const Rank = db.Rank;

const getRankById = async (rank_id) => {
  const rank = await Rank.findByPk(rank_id);
  return rank;
};

module.exports = {
  getRankById,
};
