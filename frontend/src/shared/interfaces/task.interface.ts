import { UserCardInterface } from '@/shared/interfaces/user-card.interface';

export interface TaskInterface {
  id: string;
  taskName: string;
  description: string;
  priority: 'high' | 'low' | 'normal';
  deadline: Date;
  assignees: UserCardInterface[];
  taskStatusId: string;
  taskIndex: number;
}
