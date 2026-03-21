import { prisma } from "../../config/db.js";

const logout = async (req, res) => {
  await prisma.user.update({
    where: { id: req.user.id },
    data: { refreshToken: null },
  });

  res.clearCookie("access_token");
  res.clearCookie("refresh_token", { path: "/auth/refresh" });

  return res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};

export { logout };
