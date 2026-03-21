/*
  Warnings:

  - You are about to drop the column `emailVerifyExpress` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "emailVerifyExpress",
ADD COLUMN     "emailVerifyExpires" TIMESTAMP(3);
