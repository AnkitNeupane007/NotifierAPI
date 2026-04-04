import { prisma } from "../../config/db.js";

// Module imports
import crypto from "crypto";

import AppError from "../../utils/AppError.js";

const verifyEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    throw new AppError("Verification token is required", 400);
  }

  const hashedVerificationToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await prisma.user.findFirst({
    where: {
      emailVerifyToken: hashedVerificationToken,
      emailVerifyExpires: {
        gt: new Date(),
      },
      isDeleted: false,
    },
  });

  if (!user) {
    throw new AppError("Invalid or expired verification token", 400);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isEmailVerified: true,
      emailVerifyToken: null,
      emailVerifyExpires: null,
    },
  });

  return res.status(200).json({
    status: "success",
    message: "Email verified successfully",
  });
};

export { verifyEmail };

