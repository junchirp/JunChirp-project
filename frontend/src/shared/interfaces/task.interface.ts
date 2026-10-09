import { UserBaseInterface } from '@/shared/interfaces/user-base.interface';
import { TaskPriorityType } from '@/shared/types/task-proirity.type';

export interface TaskInterface {
  id: string;
  taskName: string;
  description: string;
  priority: TaskPriorityType;
  deadline: Date;
  assignee: UserBaseInterface;
  taskStatusId: string;
  taskIndex: number;
}
