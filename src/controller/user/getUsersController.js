import { prisma } from "../../config/db.js";
import { formatUserResponse } from "../../utils/formatUserResponse.js";

const getUsers = async (req, res) => {
  const userList = await prisma.user.findMany({
    where: {
      isDeleted: false,
    },
    select: {
      id: true,
      name: true,
      email: true,
      isDeleted: true,
      isEmailVerified: true,
      profilePictureUrl: true,
      updatedAt: true,
    },
  });

  const formattedUsers = userList.map((user) => formatUserResponse(user));

  return res.status(200).json({
    status: "success",
    data: {
      users: {
        formattedUsers,
      },
    },
  });
};

export default getUsers;
