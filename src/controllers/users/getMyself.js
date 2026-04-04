import { formatUserResponse } from "../../utils/formatUserResponse.js";
import { prisma } from "../../config/db.js";

const getMyself = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
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

export default getMyself;
