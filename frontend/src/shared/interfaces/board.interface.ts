import { TaskStatusInterface } from '@/shared/interfaces/task-status.interface';

export interface BoardInterface {
  id: string;
  boardName: string;
  projectId: string;
  columns: TaskStatusInterface[];
}
