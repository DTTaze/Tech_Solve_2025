"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("coins", [
      {
        id: 1,
        amount: 1000,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        amount: 2000,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        amount: 3000,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        amount: 4000,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 5,
        amount: 5000,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 6,
        amount: 6000,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 7,
        amount: 7000,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 8,
        amount: 8000,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete("coins", null, {});
  }
};