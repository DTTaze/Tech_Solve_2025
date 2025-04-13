"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Event extends Model {
        static associate(models) {
            Event.hasMany(models.EventUser, {
                foreignKey: "event_id",
                onDelete: "CASCADE",
            });
        }
    }
    
    Event.init(
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
            description: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            total_tasks: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 1,
            },
            location: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            image_url: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            capacity: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            start_time: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            end_time: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM("upcoming", "ongoing", "finished"),
                defaultValue: "upcoming",
            },
        },
        {
        sequelize,
        modelName: "Event",
        tableName: "events",
        }
    );
    
    return Event;
    }