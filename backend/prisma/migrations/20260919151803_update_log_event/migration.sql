-- DropIndex
DROP INDEX "log_events_created_at_idx";

-- DropIndex
DROP INDEX "log_events_event_type_idx";

-- AlterTable
ALTER TABLE "log_events" ADD COLUMN     "metadata" JSONB,
ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
