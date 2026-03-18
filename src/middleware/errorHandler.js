import { env } from "../config/envValidator.js";

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (err.code === "P2025") {
    return res.status(404).json({
      status: "error",
      message: "Resource not found.",
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
