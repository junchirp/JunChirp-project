'use client';

import { useTranslations } from 'next-intl';
import { localizeOptions } from '@/shared/utils/localizeOptions';
import { SelectOptionsInterface } from '@/shared/interfaces/select-options.interface';
import { ProjectsCountWithKeyInterface } from '@/shared/interfaces/projects-count-with-key.interface';
import { projectsCountOptions } from '@/shared/constants/projects-count-options';

export const useActiveProjectsOptions = (): SelectOptionsInterface[] => {
  const t = useTranslations('projectsCount');
  return localizeOptions<ProjectsCountWithKeyInterface>(
    projectsCountOptions,
    t,
  );
};
