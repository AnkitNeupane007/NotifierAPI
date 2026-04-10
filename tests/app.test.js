import request from "supertest";
import app from "../src/app.js";
import { disconnectDB } from "../src/config/db.js";
import redisClient from "../src/config/redis.js";
import { jest } from "@jest/globals";

describe("Application Smoke Tests", () => {
  beforeAll(() => {
    // Silence logs.
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(async () => {
    // Teardown connections to prevent jest from hanging
    await disconnectDB();
    if (redisClient.status === "ready" || redisClient.status === "connect") {
      await redisClient.quit();
    }
    jest.restoreAllMocks();
  });

  it("should respond to a basic non-existent route with 404", async () => {
    const res = await request(app).get("/health/non-existent-route");
    expect(res.status).toBe(404);
  });

  describe("Auth Routes Critical Path", () => {
    it("should reject login with empty payload (400 Bad Request)", async () => {
      // Validating that the validator works and the app doesn't crash on empty payloads
      const res = await request(app).post("/auth/login").send({});
      // Assuming a validator middleware handles empty structures giving a 400 validation error
      expect(res.status).toBeGreaterThanOrEqual(400);
      expect(res.status).toBeLessThan(500);
    });

    it("should reject registration with empty payload safely", async () => {
      const res = await request(app).post("/auth/register").send({});
      expect(res.status).toBeGreaterThanOrEqual(400);
      expect(res.status).toBeLessThan(500);
    });
  });

  describe("Announcements Routes Critical Path", () => {
    it("should have an accessible /announcements endpoint", async () => {
      // Check if GET /announcements is accessible (might be 200 for public or 401 if auth required)
      const res = await request(app).get("/announcements");
      // As long as it's not a 5xx Server Error, the app is healthy
      expect(res.status).not.toBeGreaterThanOrEqual(500);
    });
  });
});
