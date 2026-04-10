import { prisma } from "../../config/db.js";
import { formatUserResponse } from "../../utils/formatUserResponse.js";

const getUsers = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  const where = {
    isDeleted: false,
  };

  const [userList, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        isDeleted: true,
        profilePictureUrl: true,
        updatedAt: true,
      },
      take: limit,
      skip: skip,
    }),
    prisma.user.count({ where }),
  ]);

  const formattedUsers = userList.map((user) => formatUserResponse(user));

  return res.status(200).json({
    status: "success",
    data: {
      users: formattedUsers,
    },
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
    },
  });
};

export default getUsers;
