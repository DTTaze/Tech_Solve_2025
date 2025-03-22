"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class RolePermission extends Model {
    static associate(models) {
      RolePermission.belongsTo(models.Role, {
        foreignKey: "role_id",
        as: "roles",
      });

      RolePermission.belongsTo(models.Permission, {
        foreignKey: "permission_id",
        as: "permissions",
      });
    }
  }
  RolePermission.init(
    {
      role_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "roles",
          key: "id",
        },
        primaryKey: true,
      },
      permission_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "permissions",
          key: "id",
        },
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: "RolePermission",
      tableName: "role_permissions",
    }
  );

  return RolePermission;
};
