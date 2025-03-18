"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    static associate(models) {
      Task.hasMany(models.TaskType, { foreignKey: "taskId", onDelete: "CASCADE" });
    }
  }

  Task.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      coins: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      difficulty: {
        type: DataTypes.ENUM("easy", "medium", "hard"),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Task",
      tableName: "tasks",
      timestamps: true,
    }
  );

  return Task;
};
