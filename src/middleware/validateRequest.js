import AppError from "../utils/AppError.js";

export const validateRequest = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((err) => ({
        message: err.message,
        path: err.path.join("."), // converts ["email"] → "email"
      }));

      const formattedMessage = errors
        .map((err) => `${err.path}: ${err.message}`)
        .join(", ");

      return next(new AppError(formattedMessage, 400));
    }
    req.body = result.data;
    next();
  };
};
