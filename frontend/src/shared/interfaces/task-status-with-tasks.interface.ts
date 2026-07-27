import { TaskStatusInterface } from '@/shared/interfaces/task-status.interface';
import { TaskInterface } from '@/shared/interfaces/task.interface';

export interface TaskStatusWithTasksInterface extends TaskStatusInterface {
  tasks: TaskInterface[];
}
