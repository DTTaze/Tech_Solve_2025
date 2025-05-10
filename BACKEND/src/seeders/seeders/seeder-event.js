"use strict";
const { nanoid } = require("nanoid");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("events", [
      {
        id: 1,
        public_id: nanoid(),
        creator_id: 2,
        title: "[37 ĐỘ SỰ KIỆN] -  “ĐỔI RÁC LẤY QUÀ XINH",
        description:
          "Đổi rác lấy quà xinh” là một sự kiện “xanh” được CLB 37 Độ Sinh Viên tổ chức với mục đích thu gom những “rác thải” thường ngày của các bạn sinh viên như: chai nhựa, lon nước, giấy,…đổi lấy những món quà xinh xắn và thân thiện với môi trường. Với mong muốn mang lại một sự kiện ý nghĩa, lan tỏa thông điệp bảo vệ môi trường, hành trình “đổi rác” của 37 Độ Sinh Viên đã diễn ra được ba mùa. Với lần quay trở lại này hứa hẹn sẽ không phụ lòng các PTIT-ers với nhiều món quà xinh xắn và những hoạt động truyền cảm hứng! Các bạn chỉ cần mang theo những loại rác thải thường ngày như: chai nhựa, lon nước, giấy,...đến sự kiện để đổi lấy 30 bánh xà phòng hữu cơ đến từ HTX Sinh Dược hoặc sen đá và nhận điểm rèn luyện. ",
        location:
          "Sảnh chính văn phòng Đoàn (Trước Hội trường D tại Học viện Công nghệ Bưu chính Viễn thông TP.HCM)",
        capacity: 100,
        coins: 7000,
        end_sign: new Date("2025-04-25"),
        start_time: new Date("2025-05-06"),
        end_time: new Date("2025-05-07"),
        created_at: Sequelize.literal("CURDATE() - INTERVAL 18 DAY"),
        updated_at: Sequelize.literal("CURDATE() - INTERVAL 18 DAY"),
      },
      {
        id: 2,
        public_id: nanoid(),
        creator_id: 3,
        title: "Event 2",
        description: "Description for Event 2",
        location: "Location for Event 2",
        capacity: 100,
        coins: 6000,
        end_sign: Sequelize.literal("CURDATE() - INTERVAL 8 DAY"),
        start_time: Sequelize.literal("CURDATE() + INTERVAL 5 DAY"),
        end_time: Sequelize.literal(
          "CURDATE() + INTERVAL 5 DAY + INTERVAL 5 HOUR"
        ),
        created_at: Sequelize.literal("CURDATE() - INTERVAL 10 DAY"),
        updated_at: Sequelize.literal("CURDATE() - INTERVAL 10 DAY"),
      },
      {
        id: 3,
        public_id: nanoid(),
        creator_id: 4,
        title: "Event 3",
        description: "Description for Event 3",
        location: "Location for Event 3",
        capacity: 100,
        coins: 1000,
        end_sign: Sequelize.literal("CURDATE() + INTERVAL 15 DAY"),
        start_time: Sequelize.literal("CURDATE() + INTERVAL 20 DAY"),
        end_time: Sequelize.literal(
          "CURDATE() + INTERVAL 20 DAY + INTERVAL 5 HOUR"
        ),
        created_at: Sequelize.literal("CURDATE()"),
        updated_at: Sequelize.literal("CURDATE()"),
      },
      {
        id: 4,
        public_id: nanoid(),
        creator_id: 4,
        title: "Event 4",
        description: "Description for Event 4",
        location: "Location for Event 4",
        capacity: 100,
        coins: 3000,
        end_sign: Sequelize.literal("CURDATE() - INTERVAL 15 DAY"),
        start_time: Sequelize.literal("CURDATE() - INTERVAL 7 DAY"),
        end_time: Sequelize.literal(
          "CURDATE() - INTERVAL 6 DAY - INTERVAL 20 HOUR"
        ),
        created_at: Sequelize.literal("CURDATE() - INTERVAL 30 DAY"),
        updated_at: Sequelize.literal("CURDATE() - INTERVAL 30 DAY"),
      },
      {
        id: 5,
        public_id: nanoid(),
        creator_id: 3,
        title: "Event 5",
        description: "Description for Event 5",
        location: "Location for Event 5",
        capacity: 100,
        coins: 4000,
        end_sign: Sequelize.literal("CURDATE() - INTERVAL 10 DAY"),
        start_time: Sequelize.literal("CURDATE() + INTERVAL 16 HOUR"),
        end_time: Sequelize.literal("CURDATE() + INTERVAL 21 HOUR"),
        created_at: Sequelize.literal("CURDATE() - INTERVAL 16 DAY"),
        updated_at: Sequelize.literal("CURDATE() - INTERVAL 16 DAY"),
      },
      {
        id: 6,
        public_id: nanoid(),
        creator_id: 1,
        title: "Event 6",
        description: "Description for Event 6",
        location: "Location for Event 6",
        capacity: 100,
        coins: 10000,
        end_sign: Sequelize.literal("CURDATE() - INTERVAL 13 DAY"),
        start_time: Sequelize.literal("CURDATE() + INTERVAL 16 HOUR"),
        end_time: Sequelize.literal("CURDATE() + INTERVAL 21 HOUR"),
        created_at: Sequelize.literal("CURDATE() - INTERVAL 16 DAY"),
        updated_at: Sequelize.literal("CURDATE() - INTERVAL 16 DAY"),
      },
      {
        id: 7,
        public_id: nanoid(),
        creator_id: 3,
        title: "Event 7",
        description: "Description for Event 7",
        location: "Location for Event 7",
        capacity: 100,
        coins: 4000,
        end_sign: Sequelize.literal("CURDATE() - INTERVAL 10 DAY"),
        start_time: Sequelize.literal("CURDATE() - INTERVAL 4 DAY"),
        end_time: Sequelize.literal(
          "CURDATE() - INTERVAL 3 DAY - INTERVAL 18 HOUR"
        ),
        created_at: Sequelize.literal("CURDATE() - INTERVAL 18 DAY"),
        updated_at: Sequelize.literal("CURDATE() - INTERVAL 18 DAY"),
      },
      {
        id: 8,
        public_id: nanoid(),
        creator_id: 4,
        title: "Event 8",
        description: "Description for Event 8",
        location: "Location for Event 8",
        capacity: 100,
        coins: 7000,
        end_sign: Sequelize.literal("CURDATE() - INTERVAL 15 DAY"),
        start_time: Sequelize.literal("CURDATE() + INTERVAL 16 HOUR"),
        end_time: Sequelize.literal("CURDATE() + INTERVAL 21 HOUR"),
        created_at: Sequelize.literal("CURDATE() - INTERVAL 18 DAY"),
        updated_at: Sequelize.literal("CURDATE() - INTERVAL 18 DAY"),
      },
      {
        id: 9,
        public_id: nanoid(),
        creator_id: 1,
        title: "Event 1",
        description: "Description for Event 1",
        location: "Location for Event 1",
        capacity: 100,
        coins: 4500,
        end_sign: Sequelize.literal("CURDATE() - INTERVAL 10 DAY"),
        start_time: Sequelize.literal("CURDATE() - INTERVAL 5 DAY"),
        end_time: Sequelize.literal(
          "CURDATE() - INTERVAL 4 DAY - INTERVAL 15 HOUR"
        ),
        created_at: Sequelize.literal("CURDATE() - INTERVAL 20 DAY"),
        updated_at: Sequelize.literal("CURDATE() - INTERVAL 20 DAY"),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("events", null, {});
  },
};
