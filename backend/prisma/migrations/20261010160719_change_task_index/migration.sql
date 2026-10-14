DROP INDEX "tasks_task_status_id_task_index_key";

ALTER TABLE "tasks"
ADD CONSTRAINT "tasks_task_status_id_task_index_key"
UNIQUE ("task_status_id", "task_index")
DEFERRABLE INITIALLY DEFERRED;
