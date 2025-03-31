"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("task_users", [
      {
        user_id: 1,
        task_id: 1,
        assigned_at: new Date(),
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 2,
        task_id: 2,
        assigned_at: new Date(),
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 1,
        task_id: 2,
        progress_count: 5,
        assigned_at: new Date(),
        completed_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("task_users", null, {});
  },
};
