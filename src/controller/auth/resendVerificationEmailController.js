import { prisma } from "../../config/db.js";

// Module imports
import crypto from "crypto";

// Utils imports
import { sendVerificationEmail } from "../../utils/sendVerificationEmail.js";

import AppError from "../../utils/AppError.js";

const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || user.isDeleted) {
    return res.status(200).json({
      status: "success",
      message:
        "If an account exists with that email, a verification link has been sent.",
    });
  }

  if (user.isEmailVerified) {
    return res.status(200).json({
      status: "success",
      message: "Email is already verified",
    });
  }

  // Generate a new token and expiry
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerifyToken: hashedToken,
      emailVerifyExpires: expires,
    },
  });

  // Send the email with the new token
  await sendVerificationEmail({ ...user, token: verificationToken });

  return res.status(200).json({
    status: "success",
    message: "Verification email resent successfully",
  });
};
export { resendVerificationEmail };
