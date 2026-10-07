/*
  Warnings:

  - A unique constraint covering the columns `[task_status_id,task_index]` on the table `tasks` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tasks_task_status_id_task_index_key" ON "tasks"("task_status_id", "task_index");
