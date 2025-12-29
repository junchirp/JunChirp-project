import { ParticipantsOptionsWithKeyInterface } from '../interfaces/participants-options-with-key.interface';

export const projectParticipantsOptions: ParticipantsOptionsWithKeyInterface[] =
  [
    {
      id: '1',
      labelKey: 'all',
      min: 0,
      max: 0,
    },
    {
      id: '2',
      labelKey: 'lessThan5',
      min: 1,
      max: 4,
    },
    {
      id: '3',
      labelKey: 'from5to10',
      min: 5,
      max: 10,
    },
    {
      id: '4',
      labelKey: 'moreThan10',
      min: 11,
      max: 0,
    },
  ];
