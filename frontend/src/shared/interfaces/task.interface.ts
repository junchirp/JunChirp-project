import { UserBaseInterface } from '@/shared/interfaces/user-base.interface';
import { TaskPriorityType } from '@/shared/types/task-proirity.type';
import { TaskStatusInterface } from '@/shared/interfaces/task-status.interface';

export interface TaskInterface {
  id: string;
  taskName: string;
  description: string;
  priority: TaskPriorityType;
  deadline: Date;
  assignee: UserBaseInterface | null;
  taskStatus: TaskStatusInterface;
  taskIndex: number;
  authorId: string;
}
