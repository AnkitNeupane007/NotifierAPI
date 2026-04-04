import { prisma } from "../../config/db.js";
import AppError from "../../utils/AppError.js";

const deleteUser = async (req, res) => {
  // Find the user first
  const userId = req.params.id;

  // Do not delete yourself
  if (req.user.id === userId) {
    throw new AppError("You cannot delete yourself.", 400);
  }

  const user = await prisma.user.findFirst({
    where: { id: userId, isDeleted: false },
  });

  // Check also if already deleted
  if (!user) {
    throw new AppError("User not found.", 404);
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { isDeleted: true },
    }),
  ]);

  return res
    .status(204)
    .json({ status: "success", message: "User deleted successfully." });
};

export default deleteUser;
