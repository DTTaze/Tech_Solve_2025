"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("task_types", [
      {
        task_id: 1,
        type_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        task_id: 2,
        type_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("task_types", null, {});
  },
};
