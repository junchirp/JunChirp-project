'use client';

import { ReactElement } from 'react';
import styles from './RequestFooter.module.scss';
import VacantRoles from '@/shared/components/VacantRoles/VacantRoles';
import ProjectCardActionsWrapper from '@/shared/components/ProjectCardActionsWrapper/ProjectCardActionsWrapper';
import Button from '@/shared/components/Button/Button';
import { ProjectRoleInterface } from '@/shared/interfaces/project-role.interface';
import { useTranslations } from 'next-intl';
import { ToastKeysEnum } from '@/shared/enums/toast-keys.enum';
import { useToast } from '@/hooks/useToast';
import { useCancelRequestMutation } from '@/api/participationsApi';
import { MyParticipationInterface } from '@/shared/interfaces/my-participation.interface';

interface RequestFooterProps {
  currentRequest: MyParticipationInterface;
  vacantRoles: ProjectRoleInterface[];
  size: 'small' | 'large';
  projectId: string;
  className?: string;
}

export default function RequestFooter({
  currentRequest,
  vacantRoles,
  size,
  projectId,
  className,
}: RequestFooterProps): ReactElement {
  const tButtons = useTranslations('buttons');
  const tProjectsPage = useTranslations('projectsPage');
  const { showToast, isActive } = useToast();
  const [cancelRequest, { isLoading }] = useCancelRequestMutation();

  const handleCancelRequest = async (): Promise<void> => {
    if (isActive(ToastKeysEnum.PARTICIPATION_REQUEST)) {
      return;
    }

    try {
      await cancelRequest({
        id: currentRequest.id,
        projectId,
      }).unwrap();

      showToast({
        severity: 'success',
        summary: tProjectsPage('request.cancelSuccess'),
        life: 3000,
        actionKey: ToastKeysEnum.PARTICIPATION_REQUEST,
      });
    } catch {
      showToast({
        severity: 'error',
        summary: tProjectsPage('request.cancelError'),
        detail: tProjectsPage('request.errorDetails'),
        life: 3000,
        actionKey: ToastKeysEnum.PARTICIPATION_REQUEST,
      });
    }
  };

  return (
    <div className={styles['request-footer']}>
      <VacantRoles
        vacantRoles={vacantRoles}
        currentRequest={currentRequest}
        size={size}
        className={className}
      />
      <ProjectCardActionsWrapper size={size}>
        <Button color="green" loading={isLoading} onClick={handleCancelRequest}>
          {tButtons('cancelRequest')}
        </Button>
      </ProjectCardActionsWrapper>
    </div>
  );
}
