import { TaskStatusWithCountInterface } from '@/shared/interfaces/task-status-with-count.interface';

export interface BoardInterface {
  id: string;
  boardName: string;
  projectId: string;
  columns: TaskStatusWithCountInterface[];
}
