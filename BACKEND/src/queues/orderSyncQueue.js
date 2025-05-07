const { Queue } = require("bullmq");
const { redis } = require("../config/configRedis");

const orderSyncQueue = new Queue("orderSync", { connection: redis });

module.exports = orderSyncQueue;
