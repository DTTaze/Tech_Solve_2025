"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    static associate(models) {
    }
  }
  Image.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      reference_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      reference_type: {
        type: DataTypes.ENUM("avatar","taskSubmit"),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Image",
      tableName: "images",
    }
  );
  
  return Image;
};