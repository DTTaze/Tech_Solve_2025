"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Lấy toàn bộ users để sử dụng làm creator
    const users = await queryInterface.sequelize.query(
      `SELECT id, full_name, username FROM users`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Hàm hỗ trợ tìm creator theo id
    const getCreatorById = (id) => users.find((u) => u.id === id);

    return queryInterface.bulkInsert("transactions", [
      {
        id: 1,
        public_id: "GD-01",
        name: "Transaction 1",
        buyer_id: 1,
        item_snapshot: JSON.stringify({
          public_id: "ITEM-01",
          creator: getCreatorById(1),
          name: "Eco Bottle",
          description: "Reusable eco-friendly bottle",
          price: 1000,
        }),
        total_price: 1000,
        status: "completed",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        public_id: "GD-02",
        name: "Transaction 2",
        buyer_id: 2,
        item_snapshot: JSON.stringify({
          public_id: "ITEM-02",
          creator: getCreatorById(1),
          name: "Bamboo Toothbrush",
          description: "Sustainable bamboo toothbrush",
          price: 2000,
        }),
        total_price: 2000,
        status: "pending",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        public_id: "GD-03",
        name: "Transaction 3",
        buyer_id: 2,
        item_snapshot: JSON.stringify({
          public_id: "ITEM-10",
          creator: getCreatorById(4),
          name: "Organic Soap",
          description: "Natural handmade soap",
          price: 1500,
        }),
        total_price: 1500,
        status: "failed",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        public_id: "GD-04",
        name: "Transaction 4",
        buyer_id: 5,
        item_snapshot: JSON.stringify({
          public_id: "ITEM-04",
          creator: getCreatorById(2),
          name: "Canvas Bag",
          description: "Eco-friendly shopping bag",
          price: 2500,
        }),
        total_price: 2500,
        status: "completed",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 5,
        public_id: "GD-05",
        name: "Transaction 5",
        buyer_id: 1,
        item_snapshot: JSON.stringify({
          public_id: "ITEM-05",
          creator: getCreatorById(3),
          name: "Recycled Notebook",
          description: "Notebook made from recycled paper",
          price: 3000,
        }),
        total_price: 3000,
        status: "pending",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("transactions", null, {});
  },
};
