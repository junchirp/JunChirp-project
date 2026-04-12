'use client';

import { ReactElement } from 'react';
import styles from './RequestFooter.module.scss';
import VacantRoles from '../VacantRoles/VacantRoles';
import ProjectCardActionsWrapper from '../ProjectCardActionsWrapper/ProjectCardActionsWrapper';
import Button from '../../Button/Button';
import { ProjectParticipationInterface } from '../../../interfaces/project-participation.interface';
import { ProjectRoleInterface } from '../../../interfaces/project-role.interface';
import { useTranslations } from 'next-intl';
import { ToastKeysEnum } from '../../../enums/toast-keys.enum';
import { AuthInterface } from '../../../interfaces/auth.interface';
import { useToast } from '../../../../hooks/useToast';
import { useCancelRequestMutation } from '../../../../api/participationsApi';

interface RequestFooterProps {
  currentRequest: ProjectParticipationInterface;
  vacantRoles: ProjectRoleInterface[];
  user: AuthInterface | null;
  size: 'small' | 'large';
  className?: string;
}

export default function RequestFooter({
  currentRequest,
  vacantRoles,
  user,
  size,
  className,
}: RequestFooterProps): ReactElement {
  const tButtons = useTranslations('buttons');
  const tProjectsPage = useTranslations('projectsPage');
  const { showToast, isActive } = useToast();
  const [cancelRequest, { isLoading }] = useCancelRequestMutation();

  const handleCancelRequest = async (): Promise<void> => {
    if (currentRequest) {
      if (isActive(ToastKeysEnum.PARTICIPATION_REQUEST)) {
        return;
      }

      const result = await cancelRequest({
        id: currentRequest.id,
        userId: user?.id ?? '',
      });

      if ('error' in result) {
        showToast({
          severity: 'error',
          summary: tProjectsPage('request.cancelError'),
          detail: tProjectsPage('request.errorDetails'),
          life: 3000,
          actionKey: ToastKeysEnum.PARTICIPATION_REQUEST,
        });
      }

      if ('data' in result) {
        showToast({
          severity: 'success',
          summary: tProjectsPage('request.cancelSuccess'),
          life: 3000,
          actionKey: ToastKeysEnum.PARTICIPATION_REQUEST,
        });
      }
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
