"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Avatar extends Model {
    static associate(models) {
    }
  }

  Avatar.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Avatar",
      tableName: "Avatars",
    }
  );

  return Avatar;
};
