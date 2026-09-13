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
  'https://discord.com/channels/1362056776119488755/1362056776744435947',
];
