"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class DeliveryAccount extends Model {
    static associate(models) {
      DeliveryAccount.belongsTo(models.User, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
      });
    }
  }

  DeliveryAccount.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      carrier: {
        type: DataTypes.ENUM("ghn", "ghtk", "grab"),
        allowNull: false,
        defaultValue: "ghn",
      },
      token: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      shop_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_default: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "DeliveryAccount",
      tableName: "delivery_accounts",
    }
  );

  return DeliveryAccount;
};
