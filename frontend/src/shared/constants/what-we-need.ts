import { WhatWeNeedType } from '@/shared/interfaces/what-we-need.interface';

const emptyBlock: WhatWeNeedType = {
  title: null,
  text: null,
  buttonText: null,
  buttonRoute: '',
};

export const noAuthBlocks: WhatWeNeedType[] = [
  emptyBlock,
  emptyBlock,
  {
    title: 'noAuth.stepOne.title',
    text: 'noAuth.stepOne.description',
    buttonText: 'noAuth.stepOne.button',
    buttonRoute: '/auth/registration',
  },
  {
    title: 'noAuth.stepTwo.title',
    text: 'noAuth.stepTwo.description',
    buttonText: 'noAuth.stepTwo.button',
    buttonRoute: '/auth/registration',
  },
  {
    title: 'noAuth.stepThree.title',
    text: 'noAuth.stepThree.description',
    buttonText: 'noAuth.stepThree.button',
    buttonRoute: '/auth/registration',
  },
  emptyBlock,
  emptyBlock,
];

export const authBlocks: WhatWeNeedType[] = [
  emptyBlock,
  emptyBlock,
  {
    title: 'auth.stepOne.title',
    text: 'auth.stepOne.description',
    buttonText: 'auth.stepOne.button',
    buttonRoute: '/projects',
  },
  {
    title: 'auth.stepTwo.title',
    text: 'auth.stepTwo.description',
    buttonText: 'auth.stepTwo.button',
    buttonRoute: '/new-project',
  },
  {
    title: 'auth.stepThree.title',
    text: 'auth.stepThree.description',
    buttonText: 'auth.stepThree.button',
    buttonUrl: 'https://discord.gg/x2rdtS2Vbz',
  },
  emptyBlock,
  emptyBlock,
];
