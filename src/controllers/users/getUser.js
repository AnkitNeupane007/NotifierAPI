import { formatUserResponse } from "../../utils/formatUserResponse.js";
import { prisma } from "../../config/db.js";

const getUser = async (req, res) => {
    const userId = req.params.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      isEmailVerified: true,
      profilePictureUrl: true,
      updatedAt: true,
    },
  });

  return res.status(200).json({
    status: "success",
    data: {
      user: formatUserResponse(user),
    },
  });
};

export default getUser;
