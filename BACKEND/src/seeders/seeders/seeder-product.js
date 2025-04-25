"use strict";
const { nanoid } = require("nanoid");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("products", [
      {
        id: 1,
        public_id: nanoid(),
        seller_id: 1,
        name: "Chậu cây mini dễ thương",
        description: "Cần pass lại do không còn chỗ trưng. Tình trạng như mới.",
        price: 30000,
        category: "plants",
        product_status: "used",
        post_status: "pending",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        public_id: nanoid(),
        seller_id: 3,
        name: "Túi vải handmade xinh xắn",
        description: "Tự làm, còn dư vài cái. Pass giá rẻ cho bạn nào cần.",
        price: 50000,
        category: "handicraft",
        product_status: "new",
        post_status: "public",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        public_id: nanoid(),
        seller_id: 1,
        name: "Chai thuỷ tinh tái chế",
        description: "Còn dư nhiều chai, ai cần trang trí thì lấy nha.",
        price: 10000,
        category: "recycled",
        product_status: "used",
        post_status: "public",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        public_id: nanoid(),
        seller_id: 5,
        name: "Phân compost hữu cơ",
        description: "Tự ủ tại nhà, sạch sẽ, phù hợp cho cây trồng.",
        price: 20000,
        category: "organic",
        product_status: "new",
        post_status: "rejected",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 5,
        public_id: nanoid(),
        seller_id: 2,
        name: "Bình tưới cây mini",
        description: "Không còn dùng đến nên pass lại, ai cần lấy liền.",
        price: 25000,
        category: "other",
        product_status: "used",
        post_status: "private",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("products", null, {});
  },
};
