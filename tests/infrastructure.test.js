import { connectDB, disconnectDB, prisma } from "../src/config/db.js";
import redisClient, { connectRedis } from "../src/config/redis.js";
import { env } from "../src/config/envValidator.js";
import { supabase } from "../src/config/supabase.js";
import nodemailer from "nodemailer";
import { jest } from "@jest/globals";

describe("Infrastructure Health Checks", () => {
  beforeAll(() => {
    // Override loggers to prevent noise during tests
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(async () => {
    await disconnectDB();
    if (redisClient.status === "ready") {
      await redisClient.quit();
    }
    jest.restoreAllMocks();
  });

  it("should have valid environment variables", () => {
    expect(env).toBeDefined();
    expect(env.DATABASE_URL).toBeDefined();
    expect(env.REDIS_URL).toBeDefined();
  });

  it("should successfully connect to the database", async () => {
    await connectDB();
    // A simple query to check if DB actually responds
    const result = await prisma.$queryRaw`SELECT 1`;
    expect(result).toBeDefined();
  });

  it("should successfully connect to Redis", async () => {
    await connectRedis();
    const isReady =
      redisClient.status === "ready" || redisClient.status === "connect";
    expect(isReady).toBe(true);
    // Ping to verify
    const pong = await redisClient.ping();
    expect(pong).toBe("PONG");
  });

  it("should successfully connect to the email host", async () => {
    const transporter = nodemailer.createTransport({
      host: env.EMAIL_HOST,
      port: env.EMAIL_PORT,
      secure: false,
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS,
      },
    });

    const isVerified = await transporter.verify();
    expect(isVerified).toBe(true);
  });

  it("should successfully connect to Supabase", async () => {
    // Testing connection by trying to get empty buckets list or check auth status
    const { data, error } = await supabase.storage.listBuckets();
    expect(error).toBeNull();
    expect(data).toBeDefined();
  });
});
