"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("delivery_orders", [
      {
        id: 1,
        seller_id: 1,
        buyer_id: 2,
        order_code: "DO-001",
        status: "ready_to_pick",
        to_name: "Nguyen Van A",
        to_phone: "0901234567",
        to_address: "106 Nguyen Van Dau, Phuong 7, Binh Thanh, TP HCM",
        is_printed: false,
        created_date: new Date(),
        cod_amount: 1000000,
        weight: 500,
        payment_type_id: 2, // Người nhận thanh toán
        total_amount: 1050000,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        seller_id: 2,
        buyer_id: 3,
        order_code: "DO-002",
        status: "delivered",
        to_name: "Tran Thi B",
        to_phone: "0912345678",
        to_address: "123 Le Loi, Phuong 5, Quan 3, TP HCM",
        is_printed: true,
        created_date: new Date(),
        cod_amount: 2000000,
        weight: 1000,
        payment_type_id: 1, // Người gửi thanh toán
        total_amount: 2050000,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        seller_id: 3,
        buyer_id: 1,
        order_code: "DO-003",
        status: "cancel",
        to_name: "Le Van C",
        to_phone: "0923456789",
        to_address: "45 Tran Hung Dao, Phuong 1, Quan 1, TP HCM",
        is_printed: false,
        created_date: new Date(),
        cod_amount: 1500000,
        weight: 750,
        payment_type_id: 2, // Người nhận thanh toán
        total_amount: 1550000,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        seller_id: 2,
        buyer_id: 4,
        order_code: "DO-004",
        status: "delivering",
        to_name: "Pham Thi D",
        to_phone: "0934567890",
        to_address: "78 Nguyen Trai, Phuong 3, Quan 5, TP HCM",
        is_printed: true,
        created_date: new Date(),
        cod_amount: 2500000,
        weight: 1200,
        payment_type_id: 1, // Người gửi thanh toán
        total_amount: 2550000,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 5,
        seller_id: 1,
        buyer_id: 3,
        order_code: "DO-005",
        status: "returned",
        to_name: "Hoang Van E",
        to_phone: "0945678901",
        to_address: "12 Ly Tu Trong, Phuong Ben Nghe, Quan 1, TP HCM",
        is_printed: false,
        created_date: new Date(),
        cod_amount: 3000000,
        weight: 800,
        payment_type_id: 2, // Người nhận thanh toán
        total_amount: 3050000,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("delivery_orders", null, {});
  },
};
