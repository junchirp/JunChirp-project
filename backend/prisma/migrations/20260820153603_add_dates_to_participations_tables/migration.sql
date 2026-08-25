/*
  Warnings:

  - You are about to drop the column `updated_at` on the `participation_invites` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `participation_requests` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "participation_invites" DROP COLUMN "updated_at",
ADD COLUMN     "canceled_at" TIMESTAMP(3),
ADD COLUMN     "rejected_at" TIMESTAMP(3),
ADD COLUMN     "reserved_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "participation_requests" DROP COLUMN "updated_at",
ADD COLUMN     "canceled_at" TIMESTAMP(3),
ADD COLUMN     "rejected_at" TIMESTAMP(3),
ADD COLUMN     "reserved_at" TIMESTAMP(3);
