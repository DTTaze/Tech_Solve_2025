"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("roles", [
      { id: 1, name: "Admin", created_at: new Date(), updated_at: new Date() },
      { id: 2, name: "User", created_at: new Date(), updated_at: new Date() },
      { id: 3, name: "Customer", created_at: new Date(), updated_at: new Date() },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("roles", null, {});
  },
};
