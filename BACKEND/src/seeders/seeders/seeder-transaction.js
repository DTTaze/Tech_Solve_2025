"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("transactions", [
      {
        name: "Transaction 1",
        seller_id: 3,
        buyer_id: 1,
        item_id: 1,
        total_price: 1000,
        status: "completed",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Transaction 2",
        seller_id: 3,
        buyer_id: 2,
        item_id: 2,
        total_price: 2000,
        status: "pending",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Transaction 3",
        seller_id: 3,
        buyer_id: 2,
        item_id: 10,
        total_price: 1500,
        status: "failed",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Transaction 4",
        seller_id: 3,
        buyer_id: 5,
        item_id: 4,
        total_price: 2500,
        status: "completed",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Transaction 5",
        seller_id: 3,
        buyer_id: 1,
        item_id: 5,
        total_price: 3000,
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
