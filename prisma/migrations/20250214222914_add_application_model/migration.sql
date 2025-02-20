/*
  Warnings:

  - You are about to drop the column `name` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Application` table. All the data in the column will be lost.
  - Added the required column `job_id` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resume` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_userId_fkey";

-- AlterTable
ALTER TABLE "Application" DROP COLUMN "name",
DROP COLUMN "userId",
ADD COLUMN     "job_id" INTEGER NOT NULL,
ADD COLUMN     "resume" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Job" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "salary" DOUBLE PRECISION NOT NULL,
    "postedById" INTEGER,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_postedById_fkey" FOREIGN KEY ("postedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
