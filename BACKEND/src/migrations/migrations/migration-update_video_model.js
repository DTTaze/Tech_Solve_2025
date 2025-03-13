"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Videos", "google_drive_id");
    await queryInterface.removeColumn("Videos", "google_drive_url");

    // Thêm cột id làm khóa chính
    await queryInterface.addColumn("Videos", "id", {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    });

    await queryInterface.addColumn("Videos", "url", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn("Videos", "filename", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Videos", "google_drive_id", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });

    await queryInterface.addColumn("Videos", "google_drive_url", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.removeColumn("Videos", "id");
    await queryInterface.removeColumn("Videos", "url");
    await queryInterface.removeColumn("Videos", "filename");
  },
};
