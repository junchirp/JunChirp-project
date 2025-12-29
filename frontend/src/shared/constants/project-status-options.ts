import { SelectStatusWithKeyInterface } from '@/shared/interfaces/select-status-with-key.interface';

export const projectStatusOptions: SelectStatusWithKeyInterface[] = [
  { id: '1', value: null, labelKey: 'all' },
  { id: '2', value: 'active', labelKey: 'active' },
  { id: '3', value: 'done', labelKey: 'completed' },
];
