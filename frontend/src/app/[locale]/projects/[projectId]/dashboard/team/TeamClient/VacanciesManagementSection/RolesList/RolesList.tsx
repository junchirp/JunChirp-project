'use client';

import { ReactElement } from 'react';
import styles from './RolesList.module.scss';
import RoleButton from '@/shared/components/RoleButton/RoleButton';
import { ProjectRoleTypeInterface } from '@/shared/interfaces/project-role-type.interface';

interface RolesListProps {
  roles: ProjectRoleTypeInterface[];
  onAdd: (id: string) => void;
}

export default function RolesList(props: RolesListProps): ReactElement {
  const { roles, onAdd } = props;

  return (
    <div className={styles['roles-list']}>
      {roles.map((role) => (
        <RoleButton
          key={role.id}
          roleId={role.id}
          roleName={role.roleName}
          buttonName="Додати роль"
          onAdd={onAdd}
        />
      ))}
    </div>
  );
}
