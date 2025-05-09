"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ReceiverAccount extends Model {
    static associate(models) {
      ReceiverAccount.belongsTo(models.User, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
      });
    }
  }

  ReceiverAccount.init(
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
      to_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      to_phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      to_address: {
        type: DataTypes.TEXT, //106 nguyen van dau, p7, binh thanh, tphcm
        allowNull: false,
      },
      //to_ward_name,to_district_name,to_province_name do ben ghn cần
      to_ward_name: {
        type: DataTypes.STRING, //p7
        allowNull: false,
      },
      to_district_name: {
        type: DataTypes.STRING, //binh thanh
        allowNull: false,
      },
      to_province_name: {
        type: DataTypes.STRING, //tp hcm
        allowNull: false,
      },
      account_type: {
        type: DataTypes.ENUM("home", "office"),
        allowNull: false,
        defaultValue: "home",
      },
      is_default: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "ReceiverAccount",
      tableName: "receiver_accounts",
    }
  );

  return ReceiverAccount;
};
