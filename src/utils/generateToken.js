import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";
import crypto from "crypto";
import { env } from "../config/envValidator.js";

const signTokens = (user) => {
  const payload = { id: user.id, role: user.role };

  const access_token = jwt.sign(payload, env.ACCESS_SECRET, {
    expiresIn: env.ACCESS_EXPIRES_IN || "15m",
  });

  const refresh_token = jwt.sign(payload, env.REFRESH_SECRET, {
    expiresIn: env.REFRESH_EXPIRES_IN || "7d",
  });

  return { access_token, refresh_token };
};

const sendTokens = (res, access_token, refresh_token) => {
  res.cookie("access_token", access_token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refresh_token", refresh_token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/auth/refresh",
  });
};

const generateToken = async (user, res) => {
  const { access_token, refresh_token } = signTokens(user);

  // hash refresh token
  const hashed_refresh_token = crypto
    .createHash("sha256")
    .update(refresh_token)
    .digest("hex");

  await prisma.user.update({
    where: { id: user.id },
    data: {
      refreshToken: hashed_refresh_token,
    },
  });

  // Send to cookies
  sendTokens(res, access_token, refresh_token);
};

export { generateToken };
