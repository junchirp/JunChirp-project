DO $$
    BEGIN
        IF NOT EXISTS (
            SELECT 1
            FROM pg_type
            WHERE typname = 'LogEventType'
        ) THEN
            CREATE TYPE "LogEventType" AS ENUM (
                'REGISTRATION',
                'LOGIN',
                'GOOGLE_AUTHENTICATION',
                'LOGOUT',
                'RESET_PASSWORD',
                'EMAIL_CONFIRMATION',
                'DISCORD_CHANNEL_NOT_FOUND'
                );
        END IF;
    END
$$;

-- DropTable
DROP TABLE "log_events";

-- CreateTable
CREATE TABLE "log_events" (
                              "id" TEXT NOT NULL,
                              "description" TEXT NOT NULL,
                              "ip" TEXT,
                              "email" TEXT,
                              "event_type" "LogEventType" NOT NULL,
                              "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

                              CONSTRAINT "log_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "log_events_event_type_idx"
    ON "log_events"("event_type");

-- CreateIndex
CREATE INDEX "log_events_created_at_idx"
    ON "log_events"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "projects_discord_channel_id_key"
    ON "projects"("discord_channel_id");

-- CreateIndex
CREATE UNIQUE INDEX "projects_discord_admin_role_id_key"
    ON "projects"("discord_admin_role_id");

-- CreateIndex
CREATE UNIQUE INDEX "projects_discord_member_role_id_key"
    ON "projects"("discord_member_role_id");
