import { prisma } from "../../config/db.js";

// Module imports
import bcrypt from "bcryptjs";

// Utils imports
import { sendVerificationEmail } from "../../utils/sendVerificationEmail.js";

import AppError from "../../utils/AppError.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const userExists = await prisma.user.findUnique({ where: { email } });

  if (userExists) {
    if (userExists.isDeleted) {
      const hashedPassword = await bcrypt.hash(password, 10);

      const restoredUser = await prisma.user.update({
        where: { email },
        data: {
          name: name,
          password: hashedPassword,
          isDeleted: false,
          isEmailVerified: false,
          emailVerifyToken: null,
          emailVerifyExpires: null,
          resetPasswordToken: null,
          resetPasswordExpires: null,
        },
      });

      try {
        await sendVerificationEmail(restoredUser);
      } catch (err) {
        // If email fails, soft delete again
        await prisma.user.update({
          where: { email },
          data: { isDeleted: true },
        });
        throw new AppError(
          "Failed to send verification email. Please try again.",
          500,
        );
      }

      return res.status(200).json({
        status: "success",
        message: "Account restored. Verification email sent.",
        data: {
          user: {
            id: restoredUser.id,
            name: restoredUser.name,
            email: restoredUser.email,
            isEmailVerified: restoredUser.isEmailVerified,
          },
        },
      });
    }

    throw new AppError("User already exists", 400);
  }

  // New user creation
  const hashedPassword = await bcrypt.hash(password, 10);

  let user;
  try {
    user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isEmailVerified: false,
      },
    });

    await sendVerificationEmail(user);
  } catch (err) {
    // If creation or email fails, delete the user to avoid half-created entries
    if (user) {
      await prisma.user.delete({ where: { id: user.id } });
    }
    throw new AppError(
      "Failed to send verification email. Please try again.",
      500,
    );
  }

  return res.status(201).json({
    status: "success",
    message: "Registration successful. Verification email sent.",
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
    },
  });
};

export { register };
