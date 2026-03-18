import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";
import { env } from "../config/envValidator.js";
import AppError from "../utils/AppError.js";

// Check if token is valid
export const authMiddleware = async (req, res, next) => {
  let access_token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    access_token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.access_token) {
    access_token = req.cookies.access_token;
  }

  if (!access_token) {
    throw new AppError("Not authorized.", 401);
  }

  try {
    const decoded_access = jwt.verify(access_token, env.ACCESS_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded_access.id },
    });

    if (!user) {
      throw new AppError("User no longer exists.", 401);
    }

    req.user = user;

    next();
  } catch (error) {
    throw new AppError("Not authorized.", 401);
  }
};
