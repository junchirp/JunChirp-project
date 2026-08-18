-- DropIndex
DROP INDEX "participation_invites_user_id_project_id_key";

-- DropIndex
DROP INDEX "participation_invites_user_id_project_role_id_key";

-- DropIndex
DROP INDEX "participation_requests_user_id_project_id_key";

-- DropIndex
DROP INDEX "participation_requests_user_id_project_role_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "participation_invite_pending_user_project_unique"
    ON "participation_invites" ("user_id", "project_id")
    WHERE "status" = 'pending';

-- CreateIndex
CREATE UNIQUE INDEX "participation_request_pending_user_project_unique"
    ON "participation_requests" ("user_id", "project_id")
    WHERE "status" = 'pending';
