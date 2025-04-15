"use strict";
const { on } = require("form-data");
const { Model } = require("sequelize");
const user = require("./user");

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
    }
  );
  return Coin;
}