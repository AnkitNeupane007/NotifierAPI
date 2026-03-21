import crypto from "crypto";
import { prisma } from "../config/db.js";
import { sendEmail } from "../utils/sendMail.js";
import { env } from "../config/envValidator.js";

const sendVerificationEmail = async (user) => {
  const verificationToken = crypto.randomBytes(32).toString("hex");

  const hashedVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  const emailVerifyExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerifyToken: hashedVerificationToken,
      emailVerifyExpires,
    },
  });

  const verifyUrl = `${env.BASE_URL}/auth/verify-email?token=${verificationToken}`;

  await sendEmail({
    email: user.email,
    subject: "Verify your email",
    message: `Click this link to verify your email: ${verifyUrl}`,
  });
};

export { sendVerificationEmail };
