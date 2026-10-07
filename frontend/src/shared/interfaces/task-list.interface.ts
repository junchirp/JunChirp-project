import { TaskInterface } from '@/shared/interfaces/task.interface';

export interface TaskListInterface {
  tasks: TaskInterface[];
  cursor: number | null;
}
