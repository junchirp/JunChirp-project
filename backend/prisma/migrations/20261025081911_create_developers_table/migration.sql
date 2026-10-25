/*
  Warnings:

  - You are about to drop the column `developer_key` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_developer_key_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "developer_key";

-- CreateTable
CREATE TABLE "developers" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "developer_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "photo_url" TEXT NOT NULL,
    "linkedin_url" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "developers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "developers_user_id_key" ON "developers"("user_id");

-- AddForeignKey
ALTER TABLE "developers" ADD CONSTRAINT "developers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
