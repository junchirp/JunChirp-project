'use client';

import { ReactElement } from 'react';
import styles from './UsersList.module.scss';
import UserItem from './UserItem/UserItem';
import { useAppSelector } from '@/hooks/reduxHooks';
import authSelector from '@/redux/auth/authSelector';
import { UserCardInterface } from '@/shared/interfaces/user-card.interface';
import { ProjectCardExpandedInterface } from '@/shared/interfaces/project-card-expanded.interface';

interface UsersListProps {
  users: UserCardInterface[];
  myProjects: ProjectCardExpandedInterface[];
}

export default function UsersList({
  users,
  myProjects,
}: UsersListProps): ReactElement {
  const currentUser = useAppSelector(authSelector.selectRequiredUser);

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
