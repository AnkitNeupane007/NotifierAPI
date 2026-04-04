import { rateLimit, ipKeyGenerator } from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redisClient from "../config/redis.js";

// // General API limiter (100 per hour)
// export const apiLimiter = rateLimit({
//   windowMs: 60 * 60 * 1000, // 1 hour
//   max: 100,
//   standardHeaders: true,
//   legacyHeaders: false,
//   store: new RedisStore({
//     sendCommand: (...args) => redisClient.call(...args),
//   }),
//   message: {
//     status: "error",
//     message: "Too many requests from this IP, please try again after 1 hour",
//   },
// });

// Prevention of spam (5 per hour)
export const spamLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
  message: {
    status: "error",
    message: "Too many requests from this IP, please try again after 1 hour",
  },
});

// strict limiter for login route (15 per 15 mins)
export const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 15 mins
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req) => {
    const email = req.body?.email || "no-email";
    return `${email}_${ipKeyGenerator(req.ip)}`;
  },

  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
  message: {
    status: "error",
    message: "Too many login attempts, please try again after 15 minutes",
  },
});

// For user id based limiter
export const userLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req) => {
    return req.user?.id || ipKeyGenerator(req.ip);
  },

  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
  message: {
    status: "error",
    message:
      "Too many requests from this account, please try again after 15 minutes",
  },
});

export const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req) => {
    const email = req.body?.email || "no-email";
    return `${email}_${ipKeyGenerator(req.ip)}`;
  },

  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
  message: {
    status: "error",
    message: "Too many refresh attempts, please try again later",
  },
});

export const verificationLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req) => {
    const email = req.body?.email || "no-email";
    return `${email}_${ipKeyGenerator(req.ip)}`;
  },

  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
  message: {
    status: "error",
    message: "Too many verification attempts, please try after 1 minute",
  },
});
