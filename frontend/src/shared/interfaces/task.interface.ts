import { UserBaseInterface } from '@/shared/interfaces/user-base.interface';

export interface TaskInterface {
  id: string;
  taskName: string;
  description: string;
  priority: 'high' | 'low' | 'normal';
  deadline: Date;
  assignees: UserBaseInterface[];
  taskStatusId: string;
  taskIndex: number;
}
