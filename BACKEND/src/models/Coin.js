"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Coin extends Model {
    static associate(models) {
      Coin.hasOne(models.User, { foreignKey: "coins_id", onDelete: "CASCADE" });
    }
  }

  Coin.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Coin",
      tableName: "coins",
    }
  );
  return Coin;
};
