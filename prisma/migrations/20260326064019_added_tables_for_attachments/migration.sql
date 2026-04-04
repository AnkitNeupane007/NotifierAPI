-- CreateEnum
CREATE TYPE "announcementType" AS ENUM ('READ_ONLY', 'ASSIGNMENT');

-- CreateEnum
CREATE TYPE "submissionStatus" AS ENUM ('PENDING', 'SUBMITTED', 'GRADED');

-- AlterTable
ALTER TABLE "announcement" ADD COLUMN     "dueDate" TIMESTAMP(3),
ADD COLUMN     "maxScore" INTEGER,
ADD COLUMN     "type" "announcementType" NOT NULL DEFAULT 'READ_ONLY';

-- CreateTable
CREATE TABLE "announcement_attachment" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "announcementId" TEXT NOT NULL,

    CONSTRAINT "announcement_attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submission" (
    "id" TEXT NOT NULL,
    "status" "submissionStatus" NOT NULL DEFAULT 'PENDING',
    "grade" INTEGER,
    "submittedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "announcementId" TEXT NOT NULL,

    CONSTRAINT "submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submission_attachment" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submissionId" TEXT NOT NULL,

    CONSTRAINT "submission_attachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "submission_userId_announcementId_key" ON "submission"("userId", "announcementId");

-- AddForeignKey
ALTER TABLE "announcement_attachment" ADD CONSTRAINT "announcement_attachment_announcementId_fkey" FOREIGN KEY ("announcementId") REFERENCES "announcement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission" ADD CONSTRAINT "submission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission" ADD CONSTRAINT "submission_announcementId_fkey" FOREIGN KEY ("announcementId") REFERENCES "announcement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_attachment" ADD CONSTRAINT "submission_attachment_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
