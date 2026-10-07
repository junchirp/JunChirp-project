import { TaskPriorityType } from '@/shared/types/task-proirity.type';

export interface CreateTaskInterface {
  taskName: string;
  description: string | null;
  taskStatusId: string;
  priority: TaskPriorityType;
  deadline: Date | null;
  assigneesIds: string[];
}
