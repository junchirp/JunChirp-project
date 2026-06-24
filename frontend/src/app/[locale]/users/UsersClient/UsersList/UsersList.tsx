'use client';

import { ReactElement, useMemo } from 'react';
import styles from './UsersList.module.scss';
import UserItem from './UserItem/UserItem';
import { useAppSelector } from '@/hooks/reduxHooks';
import authSelector from '@/redux/auth/authSelector';
import { UserCardInterface } from '@/shared/interfaces/user-card.interface';
import { ProjectCardInterface } from '@/shared/interfaces/project-card.interface';
import { ProjectParticipationInterface } from '@/shared/interfaces/project-participation.interface';

interface UsersListProps {
  users: UserCardInterface[];
  myProjects: ProjectCardInterface[];
  requests: ProjectParticipationInterface[];
  invites: ProjectParticipationInterface[];
}

export default function UsersList({
  users,
  myProjects,
  requests,
  invites,
}: UsersListProps): ReactElement {
  const currentUser = useAppSelector(authSelector.selectRequiredUser);
  const requestsByUser = useMemo(() => {
    const map = new Map<string, ProjectParticipationInterface[]>();

    for (const request of requests) {
      const userRequests = map.get(request.userId);

      if (userRequests) {
        userRequests.push(request);
      } else {
        map.set(request.userId, [request]);
      }
    }

    return map;
  }, [requests]);
  const invitesByUser = useMemo(() => {
    const map = new Map<string, ProjectParticipationInterface[]>();

    for (const invite of invites) {
      const userInvites = map.get(invite.userId);

      if (userInvites) {
        userInvites.push(invite);
      } else {
        map.set(invite.userId, [invite]);
      }
    }

    return map;
  }, [invites]);

  return (
    <div className={styles['users-list']}>
      {users.map((user: UserCardInterface) => (
        <UserItem
          key={user.id}
          user={user}
          currentUser={currentUser}
          myProjects={myProjects}
          requests={requestsByUser.get(user.id) ?? []}
          invites={invitesByUser.get(user.id) ?? []}
        />
      ))}
    </div>
  );
}
