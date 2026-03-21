import { prisma } from "../../config/db.js";

// Module imports
import bcrypt from "bcryptjs";

// Utils imports
import { generateToken } from "../../utils/generateToken.js";

import AppError from "../../utils/AppError.js";

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || user.isDeleted) {
    throw new AppError("Invalid credentials", 401);
  }

  if (!user.isEmailVerified) {
    throw new AppError("Please verify your email before logging in.", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid credentials", 401);
  }

  await generateToken(user, res);

  return res.status(200).json({
    status: "success",
    data: {
      user: {
        id: user.id,
        email: user.email,
      },
    },
  });
};

export { login };
