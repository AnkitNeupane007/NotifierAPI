import AppError from "../utils/AppError.js";

export const validateRequest = (schema, source = "body") => {
  return (req, res, next) => {
    // Determine the source to validate (body, query, or params)
    const result = schema.safeParse(req[source]);

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

    Object.assign(req[source], result.data);

    next();
  };
};
