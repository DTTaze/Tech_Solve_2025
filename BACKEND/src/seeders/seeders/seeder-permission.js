"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "permissions",
      [
        {
          id: 1,
          name: "create",
          description: "Create user permission",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          name: "read",
          description: "Read user permission",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 3,
          name: "update",
          description: "Update user permission",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("permissions", null, {});
  },
};
