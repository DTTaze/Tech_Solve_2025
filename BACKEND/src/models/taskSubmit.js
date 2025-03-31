"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class TaskSubmit extends Model {
    static associate(models) {
      TaskSubmit.belongsTo(models.User, {
        foreignKey: "id_user",
        onDelete: "CASCADE",
      });
      TaskSubmit.belongsTo(models.TaskUser, {
        foreignKey: "id_task_user",
        onDelete: "CASCADE",
      });
    }
  }

  TaskSubmit.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      task_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "task_users",
          key: "id",
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      images_id: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        defaultValue: "pending",
      },
      submitted_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "TaskSubmit",
      tableName: "task_submits",
    }
  );

  return TaskSubmit;
};
