'use client';

import { useSupportContext } from '@/providers/SupportProvider';

export const useSupport = (): (() => void) => {
  const { openSupport } = useSupportContext();
  return openSupport;
};
