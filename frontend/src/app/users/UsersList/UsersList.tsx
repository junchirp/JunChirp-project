'use client';

import { ReactElement } from 'react';
import styles from './UsersList.module.scss';
import UserItem from './UserItem/UserItem';
import { useAppSelector } from '@/hooks/reduxHooks';
import authSelector from '@/redux/auth/authSelector';
import { UserCardInterface } from '@/shared/interfaces/user-card.interface';
import { ProjectCardInterface } from '../../../shared/interfaces/project-card.interface';

interface UsersListProps {
  users: UserCardInterface[];
  myProjects: ProjectCardInterface[];
}

export default function UsersList({
  users,
  myProjects,
}: UsersListProps): ReactElement | null {
  const currentUser = useAppSelector(authSelector.selectUser);

  if (!currentUser) {
    return null;
  }

  return (
    <div className={styles['users-list']}>
      {users.map((user: UserCardInterface) => (
        <UserItem
          key={user.id}
          user={user}
          currentUser={currentUser}
          myProjects={myProjects}
        />
      ))}
    </div>
  );
}
