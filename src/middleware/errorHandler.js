import { env } from "../config/envValidator.js";
import { logger } from "../utils/logger.js";
import multer  from "multer";

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
    userId: req.user?.id || null,
  });

  if (err.code === "P2025") {
    return res.status(404).json({
      status: "error",
      message: "Resource not found.",
    });
  }

  // Handle specific Multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        status: "error",
        message: `Unexpected field uploaded. Please use the correct field name for the file.`,
      });
    }

    // Fallback for other Multer errors (like exceeding size limit if not caught earlier)
    return res.status(400).json({
      status: "error",
      message: err.message,
    });
  }

  if (env.NODE_ENV === "development") {
    // Detailed error for developers

    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }

  // Production: Only send operational errors to the client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Production: Programming or unknown DB error (don't leak details)
  console.error("ERROR:", err);
  return res.status(500).json({
    status: "error",
    message: "Something went wrong on the server.",
  });
};

export default errorHandler;
