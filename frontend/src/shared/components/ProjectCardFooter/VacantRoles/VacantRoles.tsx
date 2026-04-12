'use client';

import { Fragment, ReactElement } from 'react';
import styles from './VacantRoles.module.scss';
import { ProjectParticipationInterface } from '../../../interfaces/project-participation.interface';
import { ProjectRoleInterface } from '../../../interfaces/project-role.interface';
import { useTranslations } from 'next-intl';

type VacantRolesProps = {
  vacantRoles: ProjectRoleInterface[];
  size: 'small' | 'large';
  className?: string;
} & (
  | {
      currentInvite: ProjectParticipationInterface;
      currentRequest?: never;
    }
  | {
      currentInvite?: never;
      currentRequest: ProjectParticipationInterface;
    }
  | {
      currentInvite?: never;
      currentRequest?: never;
    }
);

export default function VacantRoles({
  currentInvite,
  currentRequest,
  vacantRoles,
  size,
  className,
}: VacantRolesProps): ReactElement {
  const tForm = useTranslations('forms');
  const participation = currentInvite ?? currentRequest;
  const labelClassNames = [
    styles['vacant-roles__label'],
    size === 'small'
      ? styles['vacant-roles__label--small']
      : styles['vacant-roles__label--large'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles['vacant-roles']}>
      <p className={labelClassNames}>{tForm('requestForm.field')}:</p>
      <div className={styles['vacant-roles__roles']}>
        {vacantRoles.map((role, index) => (
          <Fragment key={role.id}>
            {index !== 0 && (
              <span className={styles['vacant-roles__role']}>/</span>
            )}
            {role.roleType.id === participation?.projectRole.roleType.id ? (
              <span
                className={`${styles['vacant-roles__role']} ${styles['vacant-roles__role--green']}`}
              >
                [{role.roleType.roleName}]
              </span>
            ) : (
              <span className={styles['vacant-roles__role']}>
                {role.roleType.roleName}
              </span>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
