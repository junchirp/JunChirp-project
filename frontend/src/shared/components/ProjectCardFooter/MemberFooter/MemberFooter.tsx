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
import { AuthInterface } from '@/shared/interfaces/auth.interface';

interface MemberFooterProps {
  project: ProjectCardInterface;
  user: AuthInterface;
  vacantRoles: ProjectRoleInterface[];
  size: 'small' | 'large';
  className?: string;
}

export default function MemberFooter({
  project,
  user,
  vacantRoles,
  size,
  className,
}: MemberFooterProps): ReactElement {
  const tButtons = useTranslations('buttons');
  const router = useRouter();
  const isMyProject = project.roles.some((role) =>
    role.users.some((u) => u.id === user.id),
  );

  const goProject = (): void => {
    if (isMyProject) {
      router.push(`/projects/${project.id}/dashboard`);
    } else {
      router.push(`/projects/${project.id}`);
    }
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
