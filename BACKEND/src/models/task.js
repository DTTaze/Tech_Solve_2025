"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  Task.init(
    {
    //   googleId: {
    //     type: DataTypes.STRING,
    //     allowNull: true,
    //     unique: true,
    //   },
    //   email: {
    //     type: DataTypes.STRING,
    //     allowNull: false,
    //     unique: true,
    //   },
    //   password: {
    //     type: DataTypes.STRING,
    //     allowNull: true,
    //   },
    //   username: {
    //     type: DataTypes.STRING,
    //     allowNull: false,
    //   },
    },
    {
      sequelize,
      modelName: "Task",
      tableName: "Tasks",
    }
  );
  
  return Task;
};
