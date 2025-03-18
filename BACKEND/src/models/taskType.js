"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class TaskType extends Model {
    static associate(models) {
      TaskType.belongsTo(models.Task, { foreignKey: "task_id" });

      TaskType.belongsTo(models.Type, { foreignKey: "type_id" });
    }
  }

  TaskType.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      taskId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Tasks",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      typeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Types", 
          key: "id",
        },
        onDelete: "CASCADE",
      },
    },
    {
      sequelize,
      modelName: "TaskType",
      tableName: "TaskTypes",
      timestamps: false,
    }
  );

  return TaskType;
};
