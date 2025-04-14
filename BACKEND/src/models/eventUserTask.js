"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class EventUserTask extends Model {
    static associate(models) {
      EventUserTask.belongsTo(models.EventUser, {
        foreignKey: "event_user_id",
        onDelete: "CASCADE",
      });
      EventUserTask.belongsTo(models.Task, {
        foreignKey: "task_id",
        onDelete: "CASCADE",
      });
    }
  }

  EventUserTask.init(
    {
      event_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "event_users",
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
      progress_count: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 0,
      },
      completed_at: {
          type: DataTypes.DATE,
          allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "EventUserTask",
      tableName: "event_user_tasks",
    }
  );

  return EventUserTask;
}