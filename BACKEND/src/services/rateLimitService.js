const Redis = require('ioredis');
const redis = require('../config/configRedis');
const redisClient = new Redis(redis);
const WINDOW_SECONDS = 15 * 60; // 15 minutes

async function recordFailedLogin(email) {
    const redisKey = `login_attempts:${email}`;

    const tx = redisClient.multi();
    tx.incr(redisKey);
    tx.expire(redisKey, WINDOW_SECONDS); 
    await tx.exec();
}

async function resetLoginAttempts(email) {
    const redisKey = `login_attempts:${email}`;
    await redisClient.del(redisKey);
}

module.exports = {
    recordFailedLogin,
    resetLoginAttempts
};