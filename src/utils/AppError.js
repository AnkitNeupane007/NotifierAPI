class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "error" : "fail";
    this.isOperational = true; // Indicates it is an expected error

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
