'use client';

import { ReactElement } from 'react';
import styles from './MemberFooter.module.scss';
import VacantRoles from '../VacantRoles/VacantRoles';
import ProjectCardActionsWrapper from '../ProjectCardActionsWrapper/ProjectCardActionsWrapper';
import Button from '../../Button/Button';
import { ProjectRoleInterface } from '../../../interfaces/project-role.interface';
import { useTranslations } from 'next-intl';
import { useRouter } from '../../../../i18n/routing';
import { ProjectCardInterface } from '../../../interfaces/project-card.interface';
import { AuthInterface } from '../../../interfaces/auth.interface';

interface MemberFooterProps {
  project: ProjectCardInterface;
  user: AuthInterface | null;
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
  const isMyProject = project.roles
    .map((role) => role.user)
    .some((member) => member && member.id === user?.id);

  const goProject = (): void => {
    if (isMyProject) {
      router.push(`/projects/${project.id}/cab`);
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
