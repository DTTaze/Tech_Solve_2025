const bcrypt = require("bcryptjs");

("use strict");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("users", [
      {
        id: 1,
        role_id: 1, // Admin
        google_id: null,
        email: "admin@example.com",
        password: bcrypt.hashSync("123", bcrypt.genSaltSync(10)),
        username: "admin",
        full_name: "Admin User",
        phone_number: "123456789",
        address: "Admin Street",
        coins: 100,
        avatar_url: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        role_id: 2, // User
        google_id: null,
        email: "user@example.com",
        password: bcrypt.hashSync("123", bcrypt.genSaltSync(10)),
        username: "user",
        full_name: "Normal User",
        phone_number: "987654321",
        address: "User Street",
        coins: 50,
        avatar_url: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        role_id: 3, // Customer
        google_id: null,
        email: "customer@example.com",
        password: bcrypt.hashSync("123", bcrypt.genSaltSync(10)),
        username: "customer",
        full_name: "Normal User",
        phone_number: "654321",
        address: "User Street",
        coins: 50,
        avatar_url: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("users", null, {});
  },
};
