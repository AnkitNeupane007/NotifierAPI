import { id } from "zod/locales";
import { prisma } from "../../config/db.js";

const getMyself = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  return res.status(200).json({
    status: "success",
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
};

export default getMyself;
