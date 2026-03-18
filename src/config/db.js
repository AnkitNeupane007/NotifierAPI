import { PrismaClient } from "@prisma/client";
import { env } from "./envValidator.js";

const prisma = new PrismaClient({
  log: env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
});

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("DB connected");
  } catch (error) {
    console.log(`DB connection error: ${error.message}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  await prisma.$disconnect();
};

export { prisma, connectDB, disconnectDB };
