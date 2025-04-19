const db = require("../models/index");
const Rank = db.Rank;

const getRankById = async (rank_id) => {
  const rank = await Rank.findByPk(rank_id);
  return rank;
};

const rearrangeRanks = async () => {
  try {
    // Get all ranks ordered by amount in descending order
    const ranks = await Rank.findAll({
      order: [['amount', 'DESC']]
    });

    // Update each rank's order based on its position in the sorted array
    for (let i = 0; i < ranks.length; i++) {
      await ranks[i].update({
        order: i + 1
      });
    }

    return ranks;
  } catch (error) {
    console.error('Error rearranging ranks:', error);
    return error;
  }
};

module.exports = {
  getRankById,
  rearrangeRanks
};
