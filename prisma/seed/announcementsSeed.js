import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const userId = "aca58d55-e8b7-44af-a8f5-2280413fea0c";

const announcements = [
  {
    title: "System Maintenance Notice",
    content:
      "The system will be under maintenance tonight from 10 PM to 12 AM.",
    priority: "HIGH",
    userId: userId,
  },
  {
    title: "New Feature Released",
    content: "We have introduced a new dashboard feature for better tracking.",
    priority: "MEDIUM",
    userId: userId,
  },
  {
    title: "Weekly Update",
    content:
      "This week’s updates include performance improvements and bug fixes.",
    priority: "LOW",
    userId: userId,
  },
  {
    title: "Security Alert",
    content:
      "Please update your password regularly to keep your account secure.",
    priority: "HIGH",
    userId: userId,
  },
  {
    title: "Team Meeting Reminder",
    content:
      "All members are requested to attend the meeting tomorrow at 3 PM.",
    priority: "MEDIUM",
    userId: userId,
  },
  {
    title: "New Policy Update",
    content: "Please review the updated company policy document.",
    priority: "MEDIUM",
    userId: userId,
  },
  {
    title: "Holiday Announcement",
    content: "The office will remain closed on the upcoming public holiday.",
    priority: "LOW",
    userId: userId,
  },
  {
    title: "Bug Fix Deployment",
    content: "A critical bug has been fixed and deployed to production.",
    priority: "HIGH",
    userId: userId,
  },
  {
    title: "Performance Improvement",
    content: "Database optimizations have improved system speed.",
    priority: "LOW",
    userId: userId,
  },
  {
    title: "Welcome Announcement",
    content: "Welcome to the new members joining our platform.",
    priority: "LOW",
    userId: userId,
  },
];

const main = async () => {
  console.log("Seeding movies.......");

  for (const ann of announcements) {
    await prisma.announcement.create({
      data: ann,
    });
    console.log(`Created announcement ${ann.title}`);
  }

  console.log("Seeding completed");
};

main()
  .catch((err) => {
    console.log(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
