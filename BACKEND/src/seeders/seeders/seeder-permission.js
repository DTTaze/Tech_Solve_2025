"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("permissions", [
      {
        id: 1,
        action: "create",
        subject: "user",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        action: "read",
        subject: "user",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        action: "update",
        subject: "user",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("permissions", null, {});
  },
};
