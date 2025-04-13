"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("tasks", [
      {
        title: "Nhặt rác tại công viên",
        description: "Thu gom và phân loại rác thải trong khu vực công viên.",
        coins: 15,
        difficulty: "easy",
        total: 10,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: "Trồng cây xanh",
        description: "Trồng ít nhất một cây xanh trong khu vực được chỉ định.",
        coins: 25,
        difficulty: "medium",
        total: 5,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: "Tiết kiệm điện",
        description: "Tắt các thiết bị điện khi không sử dụng trong một tuần.",
        coins: 10,
        difficulty: "easy",
        total: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: "Tái chế rác thải",
        description: "Thu gom ít nhất 5kg rác thải tái chế và đem đến điểm thu gom.",
        coins: 30,
        difficulty: "hard",
        total: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: "Hạn chế sử dụng túi ni lông",
        description: "Không sử dụng túi ni lông trong vòng một tuần.",
        coins: 20,
        difficulty: "medium",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: "Task 1",
        description: "Description for Task 1",
        coins: 10,
        difficulty: "easy",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: "Task 2",
        description: "Description for Task 2",
        coins: 20,
        difficulty: "medium",
        created_at: new Date(),
        updated_at: new Date(),
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("tasks", null, {});
  },
};
