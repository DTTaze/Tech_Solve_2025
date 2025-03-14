"use strict";
const { Model } = require("sequelize");

console.log("\x1b[33m%s\x1b[0m", "model: Video");

module.exports = (sequelize, DataTypes) => {
  class Video extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file sẽ tự động gọi method này.
     */
    static associate(models) {
      // Định nghĩa quan hệ nếu cần (ví dụ: Video thuộc về User)
      // Video.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  Video.init(
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
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      filename: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Video",
      tableName: "Videos",
    }
  );
  
  return Video;
};
