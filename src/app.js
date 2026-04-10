import "dotenv/config";

import express from "express";
import cookieparser from "cookie-parser";
import { connectRedis } from "./config/redis.js";
import helmet from "helmet";

// Import routes
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import announcementRoutes from "./routes/announcements.js";

// Import error middleware
import errorHandler from "./middlewares/errorHandler.js";

// Import swagger config
import { swaggerDocs } from "./config/swagger.js";

// Import logger
import { requestLogger } from "./middlewares/requestLogger.js";

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

await connectRedis(); // Connect to Redis

// Connecting to middlewares
app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());

// API routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/announcements", announcementRoutes);

// Apply swagger configuration
if (process.env.NODE_ENV !== "production") {
  swaggerDocs(app);
}

// Centralized Error middleware
app.use(errorHandler);

export default app;
