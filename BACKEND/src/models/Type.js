"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Type extends Model {
    static associate(models) {
      Type.hasMany(models.TaskType, { foreignKey: "type_id", onDelete: "CASCADE" });
    }
  }

  Type.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Type",
      tableName: "types",
    }
  );

  return Type;
};
