'use client';

import { localizeOptions } from '@/shared/utils/localizeOptions';
import { useTranslations } from 'next-intl';
import { projectParticipantsOptions } from '@/shared/constants/project-participants-options';
import { ParticipantsOptionsInterface } from '@/shared/interfaces/participants-options.interface';
import { ParticipantsOptionsWithKeyInterface } from '@/shared/interfaces/participants-options-with-key.interface';

export const useProjectParticipantsOptions =
  (): ParticipantsOptionsInterface[] => {
    const t = useTranslations('participants');
    return localizeOptions<ParticipantsOptionsWithKeyInterface>(
      projectParticipantsOptions,
      t,
    );
  };
