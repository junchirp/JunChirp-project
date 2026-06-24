'use client';

import { ReactElement } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ProjectRoleTypeInterface } from '@/shared/interfaces/project-role-type.interface';
import Button from '@/shared/components/Button/Button';
import styles from './ActiveUsersFilters.module.scss';
import X from '@/assets/icons/x.svg';
import { useTranslations } from 'next-intl';

interface FormData {
  desiredRolesIds: string[];
  activeProjectsCount: number | null;
}

interface ActiveUsersFiltersProps {
  form: UseFormReturn<FormData, unknown, FormData>;
  rolesList: ProjectRoleTypeInterface[];
  updateFilters: (
    value: Record<string, string | string[] | number | undefined | null>,
  ) => void;
}

export default function ActiveUsersFilters(
  props: ActiveUsersFiltersProps,
): ReactElement {
  const { form, rolesList, updateFilters } = props;
  const values = form.watch();
  const t = useTranslations('usersPage');

  const selectedRoles = values.desiredRolesIds.map((id) =>
    rolesList.find((item) => item.id === id),
  );

  const removeRole = (idToRemove: string): void => {
    const current = form.getValues('desiredRolesIds');
    const updated = current.filter((id) => id !== idToRemove);
    form.setValue('desiredRolesIds', updated);
    updateFilters({
      desiredRolesIds: updated,
      page: 1,
    });
  };

  return (
    <div className={styles['active-users-filters']}>
      <Button
        color="green"
        variant="link"
        onClick={() => {
          const val = {
            desiredRolesIds: [],
            activeProjectsCount: null,
          };
          form.reset(val);
          updateFilters({
            ...val,
            page: 1,
          });
        }}
      >
        {t('clearFilters')}
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
            onClick={() => {
              form.setValue('activeProjectsCount', null);
              updateFilters({
                activeProjectsCount: null,
                page: 1,
              });
            }}
            icon={<X />}
          />
          {values.activeProjectsCount}
        </div>
      )}
    </div>
  );
}
