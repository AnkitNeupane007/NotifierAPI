import morgan from "morgan";
import {logger} from "../utils/logger.js";
import {env} from "../config/envValidator.js";

const format = env.NODE_ENV === "production" ? "combined" : "dev";

const stream = {
  write: (message) => logger.info(message.trim()),
};

const requestLogger = morgan(format, { stream });

export { requestLogger };
