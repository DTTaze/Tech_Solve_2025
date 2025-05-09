"use strict";

const { nanoid } = require("nanoid");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("items", [
      {
        creator_id: 1,
        public_id: nanoid(),
        name: "Bình nước giữ nhiệt",
        description:
          "Bình nước giữ nhiệt giúp giảm thiểu sử dụng chai nhựa dùng một lần.",
        price: 150,
        status: "available",
        stock: 5,
        weight: 500,
        length: 25,
        width: 7,
        height: 7,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        creator_id: 2,
        public_id: nanoid(),
        name: "Ống hút tre",
        description: "Bộ ống hút tre tái sử dụng, thân thiện với môi trường.",
        price: 50,
        status: "available",
        stock: 10,
        weight: 100,
        length: 20,
        width: 2,
        height: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        creator_id: 3,
        public_id: nanoid(),
        name: "Túi vải canvas",
        description: "Túi vải thay thế túi nilon, có thể sử dụng nhiều lần.",
        price: 80,
        status: "available",
        stock: 15,
        weight: 300,
        length: 35,
        width: 30,
        height: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        creator_id: 4,
        public_id: nanoid(),
        name: "Bàn chải tre",
        description: "Bàn chải đánh răng làm từ tre, phân hủy sinh học.",
        price: 40,
        status: "available",
        stock: 20,
        weight: 80,
        length: 18,
        width: 3,
        height: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        creator_id: 5,
        public_id: nanoid(),
        name: "Xà phòng hữu cơ",
        description: "Xà phòng thiên nhiên không chứa hóa chất độc hại.",
        price: 120,
        status: "available",
        stock: 8,
        weight: 150,
        length: 8,
        width: 6,
        height: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        creator_id: 1,
        public_id: nanoid(),
        name: "Hộp cơm inox",
        description: "Hộp cơm làm từ inox, giúp giảm thiểu rác thải nhựa.",
        price: 200,
        status: "available",
        stock: 6,
        weight: 600,
        length: 20,
        width: 15,
        height: 8,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        creator_id: 2,
        public_id: nanoid(),
        name: "Khăn vải tái sử dụng",
        description: "Khăn vải thay thế khăn giấy, thân thiện môi trường.",
        price: 60,
        status: "available",
        stock: 12,
        weight: 200,
        length: 30,
        width: 30,
        height: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        creator_id: 3,
        public_id: nanoid(),
        name: "Sáp ong bọc thực phẩm",
        description: "Giấy bọc thực phẩm từ sáp ong, thay thế màng bọc nhựa.",
        price: 90,
        status: "available",
        stock: 9,
        weight: 120,
        length: 25,
        width: 25,
        height: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        creator_id: 4,
        public_id: nanoid(),
        name: "Ly tre",
        description: "Ly uống nước từ tre, có thể sử dụng lâu dài.",
        price: 100,
        status: "available",
        stock: 10,
        weight: 250,
        length: 10,
        width: 10,
        height: 12,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        creator_id: 5,
        public_id: nanoid(),
        name: "Giấy tái chế",
        description: "Sổ tay làm từ giấy tái chế, bảo vệ rừng.",
        price: 70,
        status: "available",
        stock: 14,
        weight: 300,
        length: 21,
        width: 15,
        height: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        creator_id: 1,
        public_id: nanoid(),
        name: "Dép lốp xe tái chế",
        description: "Dép được làm từ lốp xe cũ, bền và độc đáo.",
        price: 110,
        status: "available",
        stock: 7,
        weight: 700,
        length: 28,
        width: 10,
        height: 6,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        creator_id: 2,
        public_id: nanoid(),
        name: "Nước giặt sinh học",
        description: "Nước giặt từ thiên nhiên, an toàn cho da và môi trường.",
        price: 130,
        status: "available",
        stock: 5,
        weight: 1000,
        length: 25,
        width: 15,
        height: 10,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        creator_id: 3,
        public_id: nanoid(),
        name: "Bình xịt tinh dầu thiên nhiên",
        description: "Bình xịt khử mùi từ tinh dầu tự nhiên.",
        price: 140,
        status: "available",
        stock: 4,
        weight: 350,
        length: 18,
        width: 5,
        height: 5,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        creator_id: 4,
        public_id: nanoid(),
        name: "Đèn năng lượng mặt trời",
        description: "Đèn sử dụng năng lượng mặt trời, tiết kiệm điện.",
        price: 250,
        status: "available",
        stock: 3,
        weight: 800,
        length: 20,
        width: 20,
        height: 15,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        creator_id: 5,
        public_id: nanoid(),
        name: "Nến sáp đậu nành",
        description: "Nến thơm làm từ sáp đậu nành, không độc hại.",
        price: 90,
        status: "available",
        stock: 6,
        weight: 250,
        length: 8,
        width: 8,
        height: 9,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("items", null, {});
  },
};
