import { prisma } from "../../config/db.js";

// Module imports
import crypto from "crypto";
import jwt from "jsonwebtoken";

// Utils imports
import { generateToken } from "../../utils/generateToken.js";

import { env } from "../../config/envValidator.js";
import AppError from "../../utils/AppError.js";

const refresh = async (req, res) => {
  const refresh_token = req.cookies?.refresh_token;

  // If no refresh token exists, then nuke everything
  if (!refresh_token) {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token", { path: "/auth/refresh" });

    throw new AppError("No refresh token found. Please login again.", 401);
  }

  let decoded;

  try {
    decoded = jwt.verify(refresh_token, env.REFRESH_SECRET);
  } catch (err) {
    // If Invalid or expired token, clear both
    res.clearCookie("access_token");
    res.clearCookie("refresh_token", { path: "/auth/refresh" });

    throw new AppError("Invalid or expired refresh token. Logged out.", 403);
  }

  const hashed_refresh_token = crypto
    .createHash("sha256")
    .update(refresh_token)
    .digest("hex");

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user || user.refreshToken !== hashed_refresh_token) {
    if (user) {
      await prisma.user.update({
        where: { id: decoded.id },
        data: { refreshToken: null },
      });
    }

    res.clearCookie("access_token");
    res.clearCookie("refresh_token", { path: "/auth/refresh" });

    throw new AppError("Refresh token reuse detected. Logged out.", 403);
  }

  // Generate new tokens
  await generateToken(user, res);

  return res.status(200).json({
    status: "success",
    message: "Token refreshed",
  });
};

export { refresh };
