"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class DeliveryOrder extends Model {
    static associate(models) {
      DeliveryOrder.belongsTo(models.User, {
        foreignKey: "seller_id",
        onDelete: "CASCADE",
      });
    }
  }

  DeliveryOrder.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      public_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      item_snapshot: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      seller_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      order_code: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM(
          "pending",
          "rejected",
          "accepted",
          "ready_to_pick", // Chờ lấy hàng
          "picking", // Đang lấy hàng
          "money_collect_picking", // Đang tương tác với người gửi
          "picked", // Lấy hàng thành công
          "storing", // Nhập kho
          "transporting", // Đang trung chuyển
          "sorting", // Đang phân loại
          "delivering", // Đang giao hàng
          "delivered", // Giao hàng thành công
          "money_collect_delivering", // Đang tương tác với người nhận
          "delivery_fail", // Giao hàng không thành công
          "waiting_to_return", // Chờ xác nhận giao lại
          "return", // Chuyển hoàn
          "return_transporting", // Đang trung chuyển hàng hoàn
          "return_sorting", // Đang phân loại hàng hoàn
          "returning", // Đang hoàn hàng
          "return_fail", // Hoàn hàng không thành công
          "returned", // Hoàn hàng thành công
          "cancel", // Đơn huỷ
          "exception", // Hàng ngoại lệ
          "lost", // Hàng thất lạc
          "damage" // Hàng hư hỏng
        ),
        allowNull: true,
        defaultValue: "pending",
      },
      to_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      to_phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      to_address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      is_printed: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      created_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      cod_amount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      weight: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      payment_type_id: {
        type: DataTypes.INTEGER, //1 ng gui, 2 ng nhan
        allowNull: true,
      },
      total_amount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "DeliveryOrder",
      tableName: "delivery_orders",
    }
  );

  return DeliveryOrder;
};
