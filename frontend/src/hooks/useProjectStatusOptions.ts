'use client';

import { useTranslations } from 'next-intl';
import { localizeOptions } from '@/shared/utils/localizeOptions';
import { SelectStatusWithKeyInterface } from '@/shared/interfaces/select-status-with-key.interface';
import { SelectOptionsInterface } from '@/shared/interfaces/select-options.interface';
import { projectStatusOptions } from '@/shared/constants/project-status-options';

export const useProjectStatusOptions = (): SelectOptionsInterface[] => {
  const t = useTranslations('status');
  return localizeOptions<SelectStatusWithKeyInterface>(projectStatusOptions, t);
};
