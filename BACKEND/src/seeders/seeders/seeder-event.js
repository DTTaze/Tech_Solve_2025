"use strict";
const { nanoid } = require("nanoid");
const dayjs = require("dayjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = dayjs();

    return queryInterface.bulkInsert("events", [
      {
        public_id: nanoid(),
        creator_id: 1,
        title: "Event 1",
        description: "Description for Event 1",
        location: "Location for Event 1",
        capacity: 100,
        end_sign: now.subtract(10, "day").toDate(),
        start_time: now.subtract(5, "day").toDate(),
        end_time: now.subtract(4, "day").subtract(15, "hour").toDate(),
        created_at: now.subtract(20, "day").toDate(),
        updated_at: now.subtract(20, "day").toDate(),
      },
      {
        public_id: nanoid(),
        creator_id: 3,
        title: "Event 2",
        description: "Description for Event 2",
        location: "Location for Event 2",
        capacity: 100,
        end_sign: now.subtract(8, "day").toDate(),
        start_time: now.add(5, "day").toDate(),
        end_time: now.add(5, "day").add(5, "hour").toDate(),
        created_at: now.subtract(10, "day").toDate(),
        updated_at: now.subtract(10, "day").toDate(),
      },
      {
        public_id: nanoid(),
        creator_id: 4,
        title: "Event 4",
        description: "Description for Event 4",
        location: "Location for Event 4",
        capacity: 100,
        end_sign: now.subtract(8, "day").toDate(),
        start_time: now.add(5, "day").toDate(),
        end_time: now.add(5, "day").add(5, "hour").toDate(),
        created_at: now.subtract(10, "day").toDate(),
        updated_at: now.subtract(10, "day").toDate(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("events", null, {});
  },
};
