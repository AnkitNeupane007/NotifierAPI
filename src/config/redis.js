import Redis from "ioredis";
import { logger } from "../utils/logger.js";
import { env } from "../config/envValidator.js";

const redisClient = new Redis(env.REDIS_URL, {
  lazyConnect: true, // Prevents automatic connection on instantiation
});

redisClient.on("error", (err) => {
  logger.error("Redis Client Error", err);
});

redisClient.on("connect", () => {
  logger.info("Connected to Redis");
});

// Explicit connection function to be called at app startup
export const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    logger.error("Failed to connect to Redis", err);
  }
};

export default redisClient;
