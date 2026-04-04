import "dotenv/config";

import express from "express";
import cookieparser from "cookie-parser";
import { connectRedis } from "./config/redis.js";
import { disconnectDB } from "./config/db.js";
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

const PORT = 5001;
const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// Handle unhandled promise rejections like the database connection errors
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

// Graceful shutdown
process.on("SIGTERM", (err) => {
  console.error("SIGTERM recieved, shutting down gracefully:", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});
