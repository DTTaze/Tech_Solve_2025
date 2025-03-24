"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("types", [
      {
        type: "Type 1",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "Type 2",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("types", null, {});
  },
};
