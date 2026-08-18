-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('active', 'done');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('high', 'normal', 'low');

-- CreateEnum
CREATE TYPE "ColumnColor" AS ENUM ('blue', 'yellow', 'green', 'magenta', 'orange', 'pink', 'violet', 'cyan', 'lime', 'amber');

-- CreateEnum
CREATE TYPE "ParticipationStatus" AS ENUM ('pending', 'canceled', 'accepted', 'rejected', 'reserved');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "google_id" TEXT,
    "discord_id" TEXT,
    "email" TEXT NOT NULL,
    "avatar_url" TEXT NOT NULL,
    "password" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_blocked" BOOLEAN NOT NULL DEFAULT false,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,
    "active_projects_count" INTEGER NOT NULL DEFAULT 0,
    "done_projects_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "role_name" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "verification_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reset_password_tokens" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,

    CONSTRAINT "reset_password_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reset_password_attempts" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" TEXT NOT NULL,

    CONSTRAINT "reset_password_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "project_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "ProjectStatus" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" TIMESTAMP(3),
    "participiants_count" INTEGER NOT NULL DEFAULT 1,
    "owner_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "discord_channel_id" TEXT NOT NULL,
    "discord_admin_role_id" TEXT NOT NULL,
    "discord_member_role_id" TEXT NOT NULL,
    "discord_url" TEXT NOT NULL DEFAULT 'https://discord.gg/x2rdtS2Vbz',
    "public_url" TEXT,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_logos" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "url" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "project_id" TEXT NOT NULL,

    CONSTRAINT "project_logos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "document_name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_roles" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "slots" INTEGER NOT NULL DEFAULT 1,
    "project_id" TEXT NOT NULL,
    "role_type_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_role_types" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "role_name" TEXT NOT NULL,

    CONSTRAINT "project_role_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_categories" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),

    CONSTRAINT "project_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_category_translations" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "locale" TEXT NOT NULL,
    "category_name" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,

    CONSTRAINT "project_category_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "boards" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "board_name" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "boards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_statuses" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "status_name" TEXT NOT NULL,
    "column_index" INTEGER NOT NULL,
    "color" "ColumnColor" NOT NULL,
    "board_id" TEXT NOT NULL,

    CONSTRAINT "task_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "task_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" "TaskPriority" NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "task_index" INTEGER NOT NULL DEFAULT 1,
    "task_status_id" TEXT NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_requests" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "request" JSONB NOT NULL,

    CONSTRAINT "support_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "log_events" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "details" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "log_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "educations" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "educations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "socials" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "network" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "socials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "login_attempts" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "attempts_count" INTEGER NOT NULL,
    "blocked_until" TIMESTAMP(3),
    "user_id" TEXT NOT NULL,

    CONSTRAINT "login_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_hard_skills" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "skill_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "user_hard_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_soft_skills" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "skill_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "user_soft_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institutions" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "institution_name" TEXT NOT NULL,

    CONSTRAINT "institutions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "specializations" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "specialization_name" TEXT NOT NULL,

    CONSTRAINT "specializations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participation_invites" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "project_role_id" TEXT NOT NULL,
    "status" "ParticipationStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "participation_invites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participation_requests" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "project_role_id" TEXT NOT NULL,
    "status" "ParticipationStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "participation_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "soft_skills" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "soft_skill_name" TEXT NOT NULL,

    CONSTRAINT "soft_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hard_skills" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "hard_skill_name" TEXT NOT NULL,

    CONSTRAINT "hard_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProjectRoleToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProjectRoleToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProjectRoleTypeToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProjectRoleTypeToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_TaskToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TaskToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_active_projects_count_idx" ON "users"("active_projects_count");

-- CreateIndex
CREATE UNIQUE INDEX "roles_role_name_key" ON "roles"("role_name");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE INDEX "verification_tokens_user_id_used_idx" ON "verification_tokens"("user_id", "used");

-- CreateIndex
CREATE UNIQUE INDEX "reset_password_tokens_token_key" ON "reset_password_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "reset_password_tokens_email_key" ON "reset_password_tokens"("email");

-- CreateIndex
CREATE INDEX "projects_status_participiants_count_idx" ON "projects"("status", "participiants_count");

-- CreateIndex
CREATE INDEX "projects_status_category_id_idx" ON "projects"("status", "category_id");

-- CreateIndex
CREATE INDEX "projects_participiants_count_category_id_idx" ON "projects"("participiants_count", "category_id");

-- CreateIndex
CREATE INDEX "projects_category_id_status_participiants_count_idx" ON "projects"("category_id", "status", "participiants_count");

-- CreateIndex
CREATE INDEX "projects_status_idx" ON "projects"("status");

-- CreateIndex
CREATE INDEX "projects_category_id_idx" ON "projects"("category_id");

-- CreateIndex
CREATE INDEX "projects_participiants_count_idx" ON "projects"("participiants_count");

-- CreateIndex
CREATE UNIQUE INDEX "project_logos_project_id_key" ON "project_logos"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "documents_url_project_id_key" ON "documents"("url", "project_id");

-- CreateIndex
CREATE UNIQUE INDEX "project_roles_project_id_role_type_id_key" ON "project_roles"("project_id", "role_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "project_role_types_role_name_key" ON "project_role_types"("role_name");

-- CreateIndex
CREATE UNIQUE INDEX "project_category_translations_category_id_locale_key" ON "project_category_translations"("category_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "boards_board_name_project_id_key" ON "boards"("board_name", "project_id");

-- CreateIndex
CREATE UNIQUE INDEX "task_statuses_status_name_board_id_key" ON "task_statuses"("status_name", "board_id");

-- CreateIndex
CREATE UNIQUE INDEX "educations_user_id_institution_specialization_key" ON "educations"("user_id", "institution", "specialization");

-- CreateIndex
CREATE UNIQUE INDEX "socials_user_id_network_key" ON "socials"("user_id", "network");

-- CreateIndex
CREATE UNIQUE INDEX "login_attempts_user_id_key" ON "login_attempts"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_hard_skills_user_id_skill_name_key" ON "user_hard_skills"("user_id", "skill_name");

-- CreateIndex
CREATE UNIQUE INDEX "user_soft_skills_user_id_skill_name_key" ON "user_soft_skills"("user_id", "skill_name");

-- CreateIndex
CREATE UNIQUE INDEX "institutions_institution_name_key" ON "institutions"("institution_name");

-- CreateIndex
CREATE INDEX "institutions_institution_name_idx" ON "institutions"("institution_name");

-- CreateIndex
CREATE UNIQUE INDEX "specializations_specialization_name_key" ON "specializations"("specialization_name");

-- CreateIndex
CREATE INDEX "specializations_specialization_name_idx" ON "specializations"("specialization_name");

-- CreateIndex
CREATE UNIQUE INDEX "participation_invites_user_id_project_id_key" ON "participation_invites"("user_id", "project_id");

-- CreateIndex
CREATE UNIQUE INDEX "participation_invites_user_id_project_role_id_key" ON "participation_invites"("user_id", "project_role_id");

-- CreateIndex
CREATE UNIQUE INDEX "participation_requests_user_id_project_id_key" ON "participation_requests"("user_id", "project_id");

-- CreateIndex
CREATE UNIQUE INDEX "participation_requests_user_id_project_role_id_key" ON "participation_requests"("user_id", "project_role_id");

-- CreateIndex
CREATE UNIQUE INDEX "soft_skills_soft_skill_name_key" ON "soft_skills"("soft_skill_name");

-- CreateIndex
CREATE INDEX "soft_skills_soft_skill_name_idx" ON "soft_skills"("soft_skill_name");

-- CreateIndex
CREATE UNIQUE INDEX "hard_skills_hard_skill_name_key" ON "hard_skills"("hard_skill_name");

-- CreateIndex
CREATE INDEX "hard_skills_hard_skill_name_idx" ON "hard_skills"("hard_skill_name");

-- CreateIndex
CREATE INDEX "_ProjectRoleToUser_B_index" ON "_ProjectRoleToUser"("B");

-- CreateIndex
CREATE INDEX "_ProjectRoleTypeToUser_B_index" ON "_ProjectRoleTypeToUser"("B");

-- CreateIndex
CREATE INDEX "_TaskToUser_B_index" ON "_TaskToUser"("B");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_tokens" ADD CONSTRAINT "verification_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "project_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_logos" ADD CONSTRAINT "project_logos_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_roles" ADD CONSTRAINT "project_roles_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_roles" ADD CONSTRAINT "project_roles_role_type_id_fkey" FOREIGN KEY ("role_type_id") REFERENCES "project_role_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_category_translations" ADD CONSTRAINT "project_category_translations_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "project_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boards" ADD CONSTRAINT "boards_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_statuses" ADD CONSTRAINT "task_statuses_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_task_status_id_fkey" FOREIGN KEY ("task_status_id") REFERENCES "task_statuses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "educations" ADD CONSTRAINT "educations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "socials" ADD CONSTRAINT "socials_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "login_attempts" ADD CONSTRAINT "login_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_hard_skills" ADD CONSTRAINT "user_hard_skills_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_soft_skills" ADD CONSTRAINT "user_soft_skills_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participation_invites" ADD CONSTRAINT "participation_invites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participation_invites" ADD CONSTRAINT "participation_invites_project_role_id_fkey" FOREIGN KEY ("project_role_id") REFERENCES "project_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participation_requests" ADD CONSTRAINT "participation_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participation_requests" ADD CONSTRAINT "participation_requests_project_role_id_fkey" FOREIGN KEY ("project_role_id") REFERENCES "project_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectRoleToUser" ADD CONSTRAINT "_ProjectRoleToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "project_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectRoleToUser" ADD CONSTRAINT "_ProjectRoleToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectRoleTypeToUser" ADD CONSTRAINT "_ProjectRoleTypeToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "project_role_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectRoleTypeToUser" ADD CONSTRAINT "_ProjectRoleTypeToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TaskToUser" ADD CONSTRAINT "_TaskToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TaskToUser" ADD CONSTRAINT "_TaskToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

