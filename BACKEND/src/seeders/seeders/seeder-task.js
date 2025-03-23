"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("tasks", [
      {
        title: "Task 1",
        content: "Content for Task 1",
        description: "Description for Task 1",
        coins: 10,
        difficulty: "easy",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: "Task 2",
        content: "Content for Task 2",
        description: "Description for Task 2",
        coins: 20,
        difficulty: "medium",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("tasks", null, {});
  },
};
