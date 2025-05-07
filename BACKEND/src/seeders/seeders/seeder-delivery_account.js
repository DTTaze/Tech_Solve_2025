"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("delivery_accounts", [
      {
        id: 1,
        name : "delivery_accounts 1",
        user_id: 1,
        name: "test a",
        carrier: "ghn",
        token: "c3f24415-29b9-11f0-9b81-222185cb68c8",
        shop_id: "196506",
        is_default: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        name : "delivery_accounts 2",
        user_id: 2,
        name: "test b",
        carrier: "ghtk",
        token: "fake_token",
        shop_id: "123456",
        is_default: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("delivery_accounts", null, {});
  },
};
