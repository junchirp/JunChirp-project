'use client';

import { ReactElement } from 'react';
import styles from './MemberFooter.module.scss';
import VacantRoles from '@/shared/components/VacantRoles/VacantRoles';
import ProjectCardActionsWrapper from '@/shared/components/ProjectCardActionsWrapper/ProjectCardActionsWrapper';
import Button from '@/shared/components/Button/Button';
import { ProjectRoleInterface } from '@/shared/interfaces/project-role.interface';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { ProjectCardInterface } from '@/shared/interfaces/project-card.interface';

interface MemberFooterProps {
  project: ProjectCardInterface;
  vacantRoles: ProjectRoleInterface[];
  size: 'small' | 'large';
  checkDiscord: () => Promise<boolean>;
  className?: string;
}

export default function MemberFooter(props: MemberFooterProps): ReactElement {
  const { project, vacantRoles, size, checkDiscord, className } = props;
  const tButtons = useTranslations('buttons');
  const router = useRouter();

  const goProject = async (): Promise<void> => {
    if (!(await checkDiscord())) {
      return;
    }
    router.push(`/projects/${project.id}/dashboard`);
  };

  return (
    <div className={styles['member-footer']}>
      {vacantRoles.length ? (
        <VacantRoles
          vacantRoles={vacantRoles}
          size={size}
          className={className}
        />
      ) : null}
      <ProjectCardActionsWrapper size={size}>
        <Button color="green" onClick={goProject}>
          {tButtons('goDashboard')}
        </Button>
      </ProjectCardActionsWrapper>
    </div>
  );
}
