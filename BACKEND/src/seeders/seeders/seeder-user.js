export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          email: "John Doe",
          password: "123",
          username: "fake1",
        },
        {
          email: "John Doe2",
          password: "123",
          username: "fake2",
        },
        {
          email: "John Doe3",
          password: "123",
          username: "fake3",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
