-- AlterTable
ALTER TABLE "participation_invites" ADD COLUMN     "accepted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "participation_requests" ADD COLUMN     "accepted_at" TIMESTAMP(3);
