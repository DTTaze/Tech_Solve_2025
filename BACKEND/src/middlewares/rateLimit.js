const Redis = require('ioredis');
const redis = require('../config/configRedis');
const db = require('../models/index.js');
const User = db.User;

const redisClient = new Redis(redis);

// Rate limiting constants
const MAX_EMAIL_ATTEMPTS = 5;        // Per email address
const MAX_IP_ATTEMPTS = 20;          // Per IP (more lenient for shared networks)
const MAX_IP_EMAIL_ATTEMPTS = 5;     // Per IP-email combination
const MAX_IP_USER_AGENT_ATTEMPTS = 5; // Per IP-User-Agent combination
const BLOCK_DURATION = 15 * 60;      // 15 minutes in seconds

const loginLimiterByEmail = async (req, res, next) => {
    let email = req.body.email?.toLowerCase();
    let username = req.body.username;
    const clientIP = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'unknown';

    if (!email && !username) {
        return res.error(400, 'Email or username is required', 'MISSING_CREDENTIALS');
    }

    try {
        const condition = email ? { email } : { username };
        const user = await User.findOne({ where: condition });
        if (!user) {
            return res.error(400, `${email || username} not found`, `${email || username}_NOT_FOUND`);
        }
        email = user.email;
        req.user = user;
    } catch (error) {
        return res.error(500, 'Error looking up user', 'SERVER_ERROR');
    }

    // Create unique identifiers for rate limiting
    const ipKey = `login_attempts_ip:${clientIP}`;
    const emailKey = `login_attempts_email:${email}`;
    const ipEmailKey = `login_attempts_ip_email:${clientIP}:${email}`;
    const ipUserAgentKey = `login_attempts_ip_ua:${clientIP}:${userAgent}`;

    // Get all current attempt counts
    const [
        ipAttempts,
        emailAttempts,
        ipEmailAttempts,
        ipUserAgentAttempts
    ] = await Promise.all([
        redisClient.get(ipKey),
        redisClient.get(emailKey),
        redisClient.get(ipEmailKey),
        redisClient.get(ipUserAgentKey)
    ]);

    // Check IP-User-Agent combination (device-specific)
    if (ipUserAgentAttempts && parseInt(ipUserAgentAttempts) >= MAX_IP_USER_AGENT_ATTEMPTS) {
        return res.status(429).json({ 
            success: false,
            message: 'Too many login attempts from your device. Please try again later.',
            error: 'TOO_MANY_DEVICE_ATTEMPTS',
            retryAfter: BLOCK_DURATION
        });
    }

    // Check IP-email combination (most specific)
    if (ipEmailAttempts && parseInt(ipEmailAttempts) >= MAX_IP_EMAIL_ATTEMPTS) {
        return res.status(429).json({ 
            success: false,
            message: 'Too many login attempts for this email from your device. Please try again later.',
            error: 'TOO_MANY_IP_EMAIL_ATTEMPTS',
            retryAfter: BLOCK_DURATION
        });
    }

    // Check email-based rate limiting
    if (emailAttempts && parseInt(emailAttempts) >= MAX_EMAIL_ATTEMPTS) {
        return res.status(429).json({ 
            success: false,
            message: 'Too many login attempts for this email. Please try again later.',
            error: 'TOO_MANY_EMAIL_ATTEMPTS',
            retryAfter: BLOCK_DURATION
        });
    }

    // Check IP-based rate limiting (most lenient)
    if (ipAttempts && parseInt(ipAttempts) >= MAX_IP_ATTEMPTS) {
        return res.status(429).json({ 
            success: false,
            message: 'Too many login attempts from this network. Please try again later.',
            error: 'TOO_MANY_IP_ATTEMPTS',
            retryAfter: BLOCK_DURATION
        });
    }

    // Increment all counters
    await Promise.all([
        redisClient.incr(ipKey),
        redisClient.incr(emailKey),
        redisClient.incr(ipEmailKey),
        redisClient.incr(ipUserAgentKey)
    ]);
    
    // Set expiration for all counters
    await Promise.all([
        redisClient.expire(ipKey, BLOCK_DURATION),
        redisClient.expire(emailKey, BLOCK_DURATION),
        redisClient.expire(ipEmailKey, BLOCK_DURATION),
        redisClient.expire(ipUserAgentKey, BLOCK_DURATION)
    ]);

    next();
}

module.exports = {
    loginLimiterByEmail,
};
