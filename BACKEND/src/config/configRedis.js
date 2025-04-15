require("dotenv").config();

const redis = {
  host: process.env.REDIS_HOST || "redis",
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null,
};

module.exports = redis;
