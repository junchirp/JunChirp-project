import { WhatWeNeedType } from '@/shared/interfaces/what-we-need.interface';

export const emptyBlock: WhatWeNeedType = {
  title: null,
  text: null,
  buttonText: null,
  buttonRoute: '',
};

export const noAuthRoutes: string[] = [
  '/auth/registration',
  '/auth/registration',
  '/auth/registration',
];

export const authRoutes: string[] = [
  '/projects',
  '/new-project',
  'https://discord.gg/x2rdtS2Vbz',
];
