/*
  Warnings:

  - You are about to drop the `_TaskToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_TaskToUser" DROP CONSTRAINT "_TaskToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_TaskToUser" DROP CONSTRAINT "_TaskToUser_B_fkey";

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "user_id" TEXT;

-- DropTable
DROP TABLE "_TaskToUser";

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
