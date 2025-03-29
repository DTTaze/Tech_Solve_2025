"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("transactions", [
      {
        name: "Transaction 1",
        buyer_id: 1,
        item_id: 1,
        amount: 100,
        status: "completed",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Transaction 2",
        buyer_id: 2,
        item_id: 2,
        amount: 200,
        status: "pending",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("transactions", null, {});
  },
};
