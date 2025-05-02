require("dotenv").config();
const Redis = require("ioredis");

const redis = {
  host: process.env.REDIS_HOST || "redis",
  port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
  maxRetriesPerRequest: null,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
};

const redisClient = new Redis(redis);

module.exports = {
  redisClient,
  redis,
};
