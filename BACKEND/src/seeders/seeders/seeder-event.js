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
        title: "Thu gom rác thải nhựa",
        description: "Chiến dịch thu gom rác thải nhựa tại công viên trung tâm nhằm nâng cao ý thức bảo vệ môi trường.",
        location: "Công viên trung tâm Tao Đàn",
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
        title: "Trồng cây gây rừng",
        description: "Hoạt động trồng cây tại khu vực đồi trọc để phục hồi hệ sinh thái và giảm thiểu biến đổi khí hậu.",
        location: "Khu vực đồi Trảng Dài",
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
        title: "Chiến dịch 'No Plastic'",
        description: "Vận động người dân hạn chế sử dụng túi nilon và thay bằng túi vải, sản phẩm thân thiện môi trường.",
        location: "Chợ Hòa Bình",
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
        title: "Dọn vệ sinh bãi biển",
        description: "Tình nguyện viên tham gia dọn rác tại bãi biển và tuyên truyền về ô nhiễm đại dương.",
        location: "Bãi biển Phan Thiết",
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
        title: "Tái chế rác thải điện tử",
        description: "Hướng dẫn phân loại và thu gom rác thải điện tử đúng cách để bảo vệ sức khỏe cộng đồng.",
        location: "Nhà văn hóa quận 10",
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
        title: "Hội thảo về biến đổi khí hậu",
        description: "Chia sẻ kiến thức và giải pháp ứng phó với biến đổi khí hậu dành cho sinh viên và người dân.",
        location: "Trường ĐH Khoa học Tự nhiên",
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
        title: "Đổi rác lấy quà",
        description: "Người dân mang rác tái chế đến để đổi lấy cây xanh và quà tặng thân thiện với môi trường.",
        location: "Khu đô thị EcoCity",
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
        title: "Chiến dịch tắt đèn Giờ Trái Đất",
        description: "Cùng nhau tắt đèn trong một giờ để kêu gọi tiết kiệm năng lượng và bảo vệ Trái Đất.",
        location: "Phố đi bộ Nguyễn Huệ",
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
