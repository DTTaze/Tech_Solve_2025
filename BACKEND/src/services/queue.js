const { Queue } = require("bullmq");
require("dotenv").config();

const connection = {
  host: process.env.REDIS_HOST || "redis",
  port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
};

const purchaseQueue = new Queue("purchase", { connection });

module.exports = purchaseQueue;
