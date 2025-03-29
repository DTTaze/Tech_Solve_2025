"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    static associate(models) {
      Item.hasMany(models.User, { foreignKey: "owner_id", onDelete: "CASCADE" });

      Item.hasMany(models.Transaction, { foreignKey: "item_id", onDelete: "CASCADE" });
    }
  }

  Item.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      owner_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      status: {
        type: DataTypes.ENUM("available", "sold", "pending"),
        allowNull: false,
        defaultValue: "available",
      },
    },
    {
      sequelize,
      modelName: "Item",
      tableName: "items",
    }
  );

  return Item;
};
