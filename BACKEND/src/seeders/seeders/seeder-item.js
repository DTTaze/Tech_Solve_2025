"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("items", [
      {
        owner_id: 1,
        name: "Item 1",
        description: "Description for Item 1",
        price: 100,
        status: "available",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        owner_id: 2,
        name: "Item 2",
        description: "Description for Item 2",
        price: 200,
        status: "available",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("items", null, {});
  },
};
