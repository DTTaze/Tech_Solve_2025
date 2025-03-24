"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("task_users", [
      {
        user_id: 1,
        task_id: 1,
        status: "pending",
        assigned_at: new Date(),
        completed_at: null,
        coins_per_user: 10,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 2,
        task_id: 2,
        status: "inProgress",
        assigned_at: new Date(),
        completed_at: null,
        coins_per_user: 20,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 1,
        task_id: 2,
        status: "done",
        assigned_at: new Date(),
        completed_at: new Date(),
        coins_per_user: 15,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("task_users", null, {});
  },
};
