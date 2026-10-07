import { TaskStatusInterface } from '@/shared/interfaces/task-status.interface';

export interface TaskStatusWithCountInterface extends TaskStatusInterface {
  tasksCount: number;
}
