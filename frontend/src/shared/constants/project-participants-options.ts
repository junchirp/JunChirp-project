import { ParticipantsOptionsInterface } from '@/shared/interfaces/participants-options.interface';

export const projectParticipantsOptions: ParticipantsOptionsInterface[] = [
  {
    id: '1',
    label: 'Всі',
    min: 0,
    max: 0,
  },
  {
    id: '2',
    label: 'Менше 5',
    min: 1,
    max: 4,
  },
  {
    id: '3',
    label: '5 - 10',
    min: 5,
    max: 10,
  },
  {
    id: '4',
    label: 'Більше 10',
    min: 11,
    max: 0,
  },
];
