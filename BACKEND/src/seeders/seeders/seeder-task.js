"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("tasks", [
      {
        title: "Nhặt rác tại công viên",
        content: "Tham gia dọn dẹp rác tại công viên gần nhà.",
        description: "Thu gom và phân loại rác thải trong khu vực công viên.",
        coins: 15,
        difficulty: "easy",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: "Trồng cây xanh",
        content: "Góp phần phủ xanh môi trường bằng cách trồng cây.",
        description: "Trồng ít nhất một cây xanh trong khu vực được chỉ định.",
        coins: 25,
        difficulty: "medium",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: "Tiết kiệm điện",
        content: "Giảm tiêu thụ điện trong gia đình.",
        description: "Tắt các thiết bị điện khi không sử dụng trong một tuần.",
        coins: 10,
        difficulty: "easy",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: "Tái chế rác thải",
        content: "Phân loại và tái chế rác thải nhựa, giấy, kim loại.",
        description: "Thu gom ít nhất 5kg rác thải tái chế và đem đến điểm thu gom.",
        coins: 30,
        difficulty: "hard",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: "Hạn chế sử dụng túi ni lông",
        content: "Sử dụng túi vải hoặc túi tái sử dụng khi đi mua sắm.",
        description: "Không sử dụng túi ni lông trong vòng một tuần.",
        coins: 20,
        difficulty: "medium",
        created_at: new Date(),
        updated_at: new Date(),
      },
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
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("tasks", null, {});
  },
};
