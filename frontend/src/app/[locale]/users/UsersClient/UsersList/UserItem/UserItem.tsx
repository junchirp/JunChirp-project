'use client';

import { ReactElement, useState } from 'react';
import styles from './UserItem.module.scss';
import { AuthInterface } from '@/shared/interfaces/auth.interface';
import Button from '@/shared/components/Button/Button';
import Image from 'next/image';
import InvitePopup from '@/shared/components/InvitePopup/InvitePopup';
import { UserCardInterface } from '@/shared/interfaces/user-card.interface';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { ProjectCardExpandedInterface } from '@/shared/interfaces/project-card-expanded.interface';

interface UserItemProps {
  user: UserCardInterface;
  currentUser: AuthInterface;
  myProjects: ProjectCardExpandedInterface[];
}

export default function UserItem({
  user,
  currentUser,
  myProjects,
}: UserItemProps): ReactElement {
  const [isModalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const tPage = useTranslations('usersPage');
  const tButtons = useTranslations('buttons');

  const handleRedirect = (): void => {
    router.push(user.id === currentUser.id ? '/profile' : `/users/${user.id}`);
  };

  const closeModal = (): void => setModalOpen(false);
  const openModal = (): void => setModalOpen(true);

  return (
    <>
      <div className={styles['user-item']}>
        <div className={styles['user-item__profile']}>
          <Image
            className={styles['user-item__image']}
            src={user.avatarUrl}
            alt="bird"
            height={140}
            width={140}
          />
          <div className={styles['user-item__details']}>
            <h3 className={styles['user-item__title']}>
              {user.firstName} {user.lastName}
            </h3>
            <ul className={styles['user-item__edu-list']}>
              {user.desiredRoles.map((role) => (
                <li className={styles['user-item__edu-item']} key={role.id}>
                  {role.roleName}
                </li>
              ))}
            </ul>
            <p
              className={`${styles['user-item__projects-text']} ${styles['user-item__projects-text--green']}`}
            >
              {tPage('activeProjects')}:
              <span className={styles['user-item__projects-count']}>
                {user.activeProjectsCount}
              </span>
            </p>
            <p
              className={`${styles['user-item__projects-text']} ${styles['user-item__projects-text--gray']}`}
            >
              {tPage('completedProjects')}:
              <span className={styles['user-item__projects-count']}>
                {user.doneProjectsCount}
              </span>
            </p>
            {!!user.projectParticipationSummary.activeRequestsCount && (
              <p className={styles['user-item__projects-text']}>
                {tPage('requests')}:
                <span className={styles['user-item__projects-count']}>
                  {user.projectParticipationSummary.activeRequestsCount}
                </span>
              </p>
            )}
            {!!user.projectParticipationSummary.activeInvitesCount && (
              <p className={styles['user-item__projects-text']}>
                {tPage('invites')}:
                <span className={styles['user-item__projects-count']}>
                  {user.projectParticipationSummary.activeInvitesCount}
                </span>
              </p>
            )}
          </div>
        </div>
        <div className={styles['user-item__actions']}>
          <Button
            variant="secondary-frame"
            color="green"
            fullWidth
            onClick={handleRedirect}
          >
            {tButtons('profile')}
          </Button>
          <Button
            color="green"
            fullWidth
            disabled={
              user.activeProjectsCount === 2 ||
              user.id === currentUser.id ||
              myProjects.length === 0 ||
              myProjects.length ===
                user.projectParticipationSummary.activeRequestsCount +
                  user.projectParticipationSummary.activeInvitesCount +
                  user.projectParticipationSummary.participationsCount
            }
            onClick={openModal}
          >
            {tButtons('invite')}
          </Button>
        </div>
      </div>
      <InvitePopup
        isOpen={isModalOpen}
        onClose={closeModal}
        user={user}
        myProjects={myProjects}
      />
    </>
  );
}
