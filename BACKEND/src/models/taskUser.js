"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class TaskUser extends Model {
    static associate(models) {
      // Liên kết với Task và User
      TaskUser.belongsTo(models.User, { foreignKey: "userId", onDelete: "CASCADE" });
      TaskUser.belongsTo(models.Task, { foreignKey: "taskId", onDelete: "CASCADE" });
    }
  }

  TaskUser.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      taskId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Tasks",
          key: "id",
        },
      },
      status: {
        type: DataTypes.ENUM("pending", "inProgress", "done"),
        allowNull: false,
      },
      assignedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      coinsPerUser: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "TaskUser",
      tableName: "TaskUsers",
      timestamps: true,
    }
  );

  return TaskUser;
};
