module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("permissions", [
      {
        id: 1,
        action: "create",
        subject: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        action: "read",
        subject: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        action: "update",
        subject: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("permissions", null, {});
  },
};
