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
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(
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
        allowNull: false,
      },
      to_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      to_phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      to_address: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      is_printed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      created_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      cod_amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      weight: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      payment_type_id: {
        type: DataTypes.INTEGER, //1 ng gui, 2 ng nhan
        allowNull: false,
      },
      total_amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
