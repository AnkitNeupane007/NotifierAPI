import app from "./app.js";
import { disconnectDB } from "./config/db.js";

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
