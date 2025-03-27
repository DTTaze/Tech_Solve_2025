"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class TaskUser extends Model {
    static associate(models) {
      // Liên kết với Task và User
      TaskUser.belongsTo(models.User, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
      });
      TaskUser.belongsTo(models.Task, {
        foreignKey: "task_id",
        onDelete: "CASCADE",
      });
    }
  }

  TaskUser.init(
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
      task_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "tasks",
          key: "id",
        },
      },
      status: {
        type: DataTypes.ENUM("pending", "inProgress", "done"),
        allowNull: false,
      },
      assigned_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      completed_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      coins_per_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "TaskUser",
      tableName: "task_users",
    }
  );

  return TaskUser;
};
