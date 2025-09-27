import { SelectOptionsInterface } from '../interfaces/select-options.interface';

export const projectStatusOptions: SelectOptionsInterface[] = [
  { id: '1', value: null, label: 'Всі' },
  { id: '2', value: 'active', label: 'Активний' },
  { id: '3', value: 'done', label: 'Завершений' },
];
