'use client';

import { Fragment, ReactElement, useState } from 'react';
import styles from './page.module.scss';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useGetMyInviteByIdQuery } from '../../../api/usersApi';
import Page404 from '../../../shared/components/Page404/Page404';
import Image from 'next/image';
import { membersPipe } from '../../../shared/utils/membersPipe';
import { datePipe } from '../../../shared/utils/datePipe';
import Button from '../../../shared/components/Button/Button';
import RejectInvitePopup from '../../../shared/components/RejectInvitePopup/RejectInvitePopup';
import AuthGuard from '../../../shared/components/AuthGuard/AuthGuard';
import { ProjectCardInterface } from '../../../shared/interfaces/project-card.interface';
import { RoleWithUserInterface } from '../../../shared/interfaces/role-with-user.interface';
import { UserCardInterface } from '../../../shared/interfaces/user-card.interface';
import { useAppSelector } from '../../../hooks/reduxHooks';
import authSelector from '../../../redux/auth/authSelector';
import { useAcceptInviteMutation } from '../../../api/participationsApi';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { useToast } from '../../../hooks/useToast';

export default function InvitedProjectCard(): ReactElement | null {
  const user = useAppSelector(authSelector.selectUser);
  const params = useParams();
  const router = useRouter();
  const { showToast, isActive } = useToast();
  const inviteId = params.id as string;
  const { data: invite, isLoading } = useGetMyInviteByIdQuery(
    { inviteId, userId: user?.id },
    { skip: !user },
  );
  const [isModalOpen, setModalOpen] = useState(false);
  const pathname = usePathname();
  const [acceptInvite] = useAcceptInviteMutation();

  let project: ProjectCardInterface | null = null;
  let vacantRoles: RoleWithUserInterface[] = [];
  let members: UserCardInterface[] = [];

  if (invite) {
    project = invite.projectRole.project;
    vacantRoles = project.roles.filter((role) => !role.user);
    members = project.roles
      .map((role) => role.user)
      .filter((member) => member !== null);
  }

  const closeModal = (): void => setModalOpen(false);
  const openModal = (): void => setModalOpen(true);
  const handleAccept = async (): Promise<void> => {
    if (isActive('invite')) {
      return;
    }

    if (invite && project) {
      const result = await acceptInvite(invite.id);

      if ('data' in result) {
        router.push(`/projects/${project.id}`);
      }

      if ('error' in result) {
        const errorData = result.error as
          | ((FetchBaseQueryError | SerializedError) & {
              status: number;
            })
          | undefined;
        const status = errorData?.status;

        if (status === 403 && !user?.discordId) {
          showToast({
            severity: 'error',
            summary: 'Запрошення не прийнято - підключи Discord',
            life: 3000,
            actionKey: 'invite',
          });
        }
      }
    }
  };

  return (
    <AuthGuard
      requireVerified
      redirectTo={`/auth/login?next=${encodeURIComponent(pathname)}`}
    >
      {isLoading ? (
        <div className={styles['invited-project-card']}>
          <div className={styles['invited-project-card__skeleton']} />
        </div>
      ) : invite && project ? (
        <>
          <div className={styles['invited-project-card']}>
            <div className={styles['invited-project-card__card']}>
              <div
                className={`${styles['invited-project-card__image-wrapper']} ${!project.logoUrl ? styles['invited-project-card__image-wrapper--empty'] : ''}`}
              >
                {project.logoUrl ? (
                  <Image
                    className={styles['invited-project-card__image']}
                    src={project.logoUrl}
                    alt="logo"
                    width={236}
                    height={0}
                  />
                ) : (
                  <Image
                    src="/images/empty-image.svg"
                    alt="empty-logo"
                    width={80}
                    height={80}
                  />
                )}
              </div>
              <div className={styles['invited-project-card__content']}>
                <div className={styles['invited-project-card__info']}>
                  <div className={styles['invited-project-card__header']}>
                    <h2 className={styles['invited-project-card__title']}>
                      {project.projectName}
                    </h2>
                    <p
                      className={`${styles['invited-project-card__status']} ${project.status === 'active' ? styles['invited-project-card__status--active'] : styles['invite-project-card__status--done']}`}
                    >
                      {project.status === 'active' ? 'Активний' : 'Завершений'}
                    </p>
                  </div>
                  <p className={styles['invited-project-card__description']}>
                    {project.description}
                  </p>
                  <p className={styles['invite-project-card__category']}>
                    {project.category.categoryName}
                  </p>
                  <div className={styles['invited-project-card__footer']}>
                    <div className={styles['invited-project-card__team']}>
                      <div className={styles['invited-project-card__members']}>
                        <Image
                          src="/images/users-2.svg"
                          alt="users"
                          width={24}
                          height={24}
                        />
                        <span
                          className={styles['invited-project-card__team-text']}
                        >
                          {membersPipe(members.length)}
                        </span>
                      </div>
                      <span
                        className={styles['invited-project-card__team-text']}
                      >
                        {datePipe(project.createdAt.toString())}
                      </span>
                    </div>
                    <div
                      className={styles['invited-project-card__vacant-roles']}
                    >
                      <p className={styles['invited-project-card__label']}>
                        В пошуку:
                      </p>
                      <div className={styles['invited-project-card__roles']}>
                        {vacantRoles.map((role, index) => (
                          <Fragment key={index}>
                            {index !== 0 && <span>/</span>}
                            <span
                              className={`${role.id === invite.projectRole.id ? styles['invited-project-card__roles--current'] : ''}`}
                            >
                              {role.roleType.roleName}
                            </span>
                          </Fragment>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles['invited-project-card__actions']}>
                  <Button
                    color="red"
                    variant="secondary-frame"
                    onClick={openModal}
                  >
                    Відхилити
                  </Button>
                  <Button color="green" onClick={handleAccept}>
                    Прийняти
                  </Button>
                </div>
              </div>
            </div>
          </div>
          {isModalOpen && (
            <RejectInvitePopup
              onClose={closeModal}
              projectName={project.projectName}
              inviteId={invite.id}
            />
          )}
        </>
      ) : (
        <Page404 />
      )}
    </AuthGuard>
  );
}
