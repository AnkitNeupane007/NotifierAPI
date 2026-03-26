import { prisma } from "../../config/db.js";

const postAnnouncements = async (req, res) => {
  const { title, content, priority, type, dueDate, maxScore } = req.body;

  const userId = req.user.id;

  const announcement = await prisma.announcement.create({
    data: {
      title: title,
      content: content,
      priority: priority,
      type: type,
      dueDate: dueDate ? new Date(dueDate) : null,
      maxScore: maxScore,
      userId: userId,
    },
  });

  res.status(201).json({
    status: "success",
    data: announcement,
  });
};

export default postAnnouncements;
