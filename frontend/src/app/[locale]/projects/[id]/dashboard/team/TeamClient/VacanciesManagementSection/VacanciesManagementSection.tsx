'use client';

import { ReactElement } from 'react';
import styles from './VacanciesManagementSection.module.scss';
import { ProjectRoleTypeInterface } from '@/shared/interfaces/project-role-type.interface';
import { RoleWithUserInterface } from '@/shared/interfaces/role-with-user.interface';
import VacanciesGroupedList from '../VacanciesGroupedList/VacanciesGroupedList';
import {
  TeamRoleGroupInterface,
  TeamVacancyInterface,
} from '@/shared/interfaces/team-view-interface';
import RolesList from './RolesList/RolesList';

interface VacanciesManagementSectionProps {
  projectRoles: RoleWithUserInterface[];
  otherRoles: ProjectRoleTypeInterface[];
  onDeleteVacancy: (id: string) => void;
  onAddVacancy: (id: string) => void;
  onAddRole: (id: string) => void;
  loading: boolean;
}

export default function VacanciesManagementSection(
  props: VacanciesManagementSectionProps,
): ReactElement {
  const {
    projectRoles,
    otherRoles,
    loading,
    onAddRole,
    onAddVacancy,
    onDeleteVacancy,
  } = props;
  const vacancies: TeamRoleGroupInterface<TeamVacancyInterface>[] =
    projectRoles.map((role) => {
      const vacanciesCount = role.slots - role.users.length;

      return {
        roleId: role.id,
        roleName: role.roleType.roleName,
        items: Array.from({ length: vacanciesCount }, () => ({
          type: 'vacancy',
          roleId: role.id,
          roleName: role.roleType.roleName,
        })),
      };
    });

  return (
    <div className={styles['vacancies-management-section']}>
      <div className={styles['vacancies-management-section__role-section']}>
        <h2 className={styles['vacancies-management-section__title']}>
          Ролі в проєкті
        </h2>
        <VacanciesGroupedList
          vacancies={vacancies}
          isOwner={true}
          tab="vacancies"
          onDelete={onDeleteVacancy}
          onAdd={onAddVacancy}
          loading={loading}
        />
      </div>
      <div className={styles['vacancies-management-section__role-section']}>
        <h2 className={styles['vacancies-management-section__title']}>
          Ролі, відсутні в проєкті
        </h2>
        <RolesList roles={otherRoles} onAdd={onAddRole} />
      </div>
    </div>
  );
}
