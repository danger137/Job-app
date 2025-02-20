/*
  Warnings:

  - You are about to drop the column `resume` on the `Application` table. All the data in the column will be lost.
  - Added the required column `applicant_email` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `applicant_name` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resume_url` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Application" DROP COLUMN "resume",
ADD COLUMN     "applicant_email" TEXT NOT NULL,
ADD COLUMN     "applicant_name" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "resume_url" TEXT NOT NULL;
