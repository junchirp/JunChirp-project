'use client';

import { ReactElement } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ProjectRoleTypeInterface } from '@/shared/interfaces/project-role-type.interface';
import Button from '@/shared/components/Button/Button';
import styles from './ActiveUsersFilters.module.scss';
import X from '@/assets/icons/x.svg';

interface FormData {
  desiredRolesIds: string[];
  activeProjectsCount: number | null;
}

interface ActiveUsersFiltersProps {
  form: UseFormReturn<FormData, unknown, FormData>;
  rolesList: ProjectRoleTypeInterface[];
}

export default function ActiveUsersFilters({
  form,
  rolesList,
}: ActiveUsersFiltersProps): ReactElement {
  const values = form.watch();

  const selectedRoles = values.desiredRolesIds.map((id) =>
    rolesList.find((item) => item.id === id),
  );

  const removeRole = (idToRemove: string): void => {
    const current = form.getValues('desiredRolesIds');
    const updated = current.filter((id) => id !== idToRemove);
    form.setValue('desiredRolesIds', updated);
  };

  return (
    <div className={styles['active-users-filters']}>
      <Button
        color="green"
        variant="link"
        onClick={() =>
          form.reset({
            desiredRolesIds: [],
            activeProjectsCount: null,
          })
        }
      >
        Очистити всі фільтри
      </Button>
      {selectedRoles.map((role) =>
        role ? (
          <div className={styles['active-users-filters__item']} key={role.id}>
            <Button
              color="gray"
              variant="link"
              size="md"
              onClick={() => removeRole(role.id)}
              icon={<X />}
            />
            {role.roleName}
          </div>
        ) : null,
      )}

      {values.activeProjectsCount !== null && (
        <div className={styles['active-users-filters__item']}>
          <Button
            color="gray"
            variant="link"
            size="md"
            onClick={() => form.setValue('activeProjectsCount', null)}
            icon={<X />}
          />
          {values.activeProjectsCount}
        </div>
      )}
    </div>
  );
}
