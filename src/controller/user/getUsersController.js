import { prisma } from "../../config/db.js";

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
    },
  });

  return res.status(200).json({
    status: "success",
    data: {
      users: {
        userList,
      },
    },
  });
};

export default getUsers;
