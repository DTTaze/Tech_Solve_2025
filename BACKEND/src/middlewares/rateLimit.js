const Redis = require('ioredis');
const redis = require('../config/configRedis');
const db = require('../models/index.js');
const User = db.User;

const redisClient = new Redis(redis);

const MAX_ATTEMPTS = 5;

const loginLimiterByEmail = async (req, res, next) => {
    let email = req.body.email?.toLowerCase();
    let username = req.body.username;

    if (!email && !username) {
        return res.status(400).json({ 
            success: false,
            message: 'Email or username is required',
            error: 'MISSING_CREDENTIALS'
        });
    }

    // If only username is provided, look up the email
    if (!email && username) {
        try {
            const user = await User.findOne({ where: { username } });
            if (!user) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Username not found',
                    error: 'USER_NOT_FOUND'
                });
            }
            email = user.email;
        } catch (error) {
            return res.status(500).json({ 
                success: false,
                message: 'Error looking up user',
                error: 'SERVER_ERROR'
            });
        }
    }

    const redisKey = `login_attempts:${email}`;

    // Get current count
    const attempts = await redisClient.get(redisKey);

    if (attempts && parseInt(attempts) >= MAX_ATTEMPTS) {
        return res.status(429).json({ 
            success: false,
            message: 'Too many login attempts. Please try again later.',
            error: 'TOO_MANY_ATTEMPTS',
            retryAfter: 15 * 60 // 15 minutes in seconds
        });
    }

    next();
}

module.exports = {
    loginLimiterByEmail,
};
