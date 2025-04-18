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
        coins_id: 1,
        rank_id: 1,
        avatar_url: null,
        last_logined: Sequelize.fn("CURDATE"),
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
        coins_id: 2,
        rank_id: 2,
        avatar_url: null,
        last_logined: Sequelize.fn("CURDATE"),
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
        coins_id: 3,
        rank_id: 3,
        avatar_url: null,
        last_logined: Sequelize.fn("CURDATE"),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        role_id: 2,
        google_id: null,
        email: "john.doe@example.com",
        password: bcrypt.hashSync("123", bcrypt.genSaltSync(10)),
        username: "johndoe",
        full_name: "John Doe",
        phone_number: "123123123",
        address: "123 Green Street",
        coins_id: 4,
        rank_id: 4,
        avatar_url: null,
        last_logined: Sequelize.fn("CURDATE"),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 5,
        role_id: 2,
        google_id: null,
        email: "jane.smith@example.com",
        password: bcrypt.hashSync("123", bcrypt.genSaltSync(10)),
        username: "janesmith",
        full_name: "Jane Smith",
        phone_number: "456456456",
        address: "456 Eco Lane",
        coins_id: 5,
        rank_id: 5,
        avatar_url: null,
        last_logined: Sequelize.fn("CURDATE"),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 6,
        role_id: 2,
        google_id: null,
        email: "david.nguyen@example.com",
        password: bcrypt.hashSync("123", bcrypt.genSaltSync(10)),
        username: "davidnguyen",
        full_name: "David Nguyen",
        phone_number: "789789789",
        address: "789 Sustainable Avenue",
        coins_id: 6,
        rank_id: 6,
        avatar_url: null,
        last_logined: Sequelize.fn("CURDATE"),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 7,
        role_id: 2,
        google_id: null,
        email: "sophia.lee@example.com",
        password: bcrypt.hashSync("123", bcrypt.genSaltSync(10)),
        username: "sophialee",
        full_name: "Sophia Lee",
        phone_number: "159159159",
        address: "159 Eco Street",
        coins_id: 7,
        rank_id: 7,
        avatar_url: null,
        last_logined: Sequelize.fn("CURDATE"),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 8,
        role_id: 2,
        google_id: null,
        email: "michael.brown@example.com",
        password: bcrypt.hashSync("123", bcrypt.genSaltSync(10)),
        username: "michaelbrown",
        full_name: "Michael Brown",
        phone_number: "753753753",
        address: "753 Green Park",
        coins_id: 8,
        rank_id: 8,
        avatar_url: null,
        last_logined: Sequelize.fn("CURDATE"),
        created_at: new Date(),
        updated_at: new Date(),
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("users", null, {});
  },
};
