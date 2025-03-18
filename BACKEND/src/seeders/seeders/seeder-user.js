const bcrypt = require("bcryptjs");

("use strict");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("users", [
      {
        id: 1,
        role_id: 1, // Admin
        googleId: null,
        email: "admin@example.com",
        password: bcrypt.hashSync("123", bcrypt.genSaltSync(10)),
        username: "admin",
        full_name: "Admin User",
        phone_number: "123456789",
        address: "Admin Street",
        coins: 100,
        avatar_url: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        role_id: 2, // User
        googleId: null,
        email: "user@example.com",
        password: bcrypt.hashSync("123", bcrypt.genSaltSync(10)),
        username: "user",
        full_name: "Normal User",
        phone_number: "987654321",
        address: "User Street",
        coins: 50,
        avatar_url: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("users", null, {});
  },
};
