'use client';

import { Fragment, ReactElement, useState } from 'react';
import styles from './ProjectCard.module.scss';
import { ProjectCardInterface } from '@/shared/interfaces/project-card.interface';
import Button from '../../../../shared/components/Button/Button';
import Image from 'next/image';
import { useAppSelector } from '../../../../hooks/reduxHooks';
import authSelector from '../../../../redux/auth/authSelector';
import { membersPipe } from '../../../../shared/utils/membersPipe';
import { datePipe } from '../../../../shared/utils/datePipe';
import { useRouter } from 'next/navigation';
import RejectInvitePopup from '../../../../shared/components/RejectInvitePopup/RejectInvitePopup';
import { ProjectParticipationInterface } from '../../../../shared/interfaces/project-participation.interface';
import { useAcceptInviteMutation } from '../../../../api/participationsApi';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { useToast } from '../../../../hooks/useToast';

interface ProjectCardProps {
  project: ProjectCardInterface;
  invites: ProjectParticipationInterface[];
  requestsProjectsIds: string[];
}

export default function ProjectCard({
  project,
  invites,
  requestsProjectsIds,
}: ProjectCardProps): ReactElement {
  const router = useRouter();
  const { showToast, isActive } = useToast();
  const user = useAppSelector(authSelector.selectUser);
  const isInvite = invites
    .map((invite) => invite.projectRole.project.id)
    .includes(project.id);
  const currentInvite = invites.find(
    (invite) => invite.projectRole.project.id === project.id,
  );
  const isRequest = requestsProjectsIds.includes(project.id);
  const vacantRolesNames = project.roles
    .filter((role) => !role.user)
    .map((role) => role.roleType.roleName);
  const members = project.roles
    .map((role) => role.user)
    .filter((member) => member !== null);
  const isMyProject = members.some((member) => member.id === user?.id);
  const [isModalOpen, setModalOpen] = useState(false);
  const [acceptInvite] = useAcceptInviteMutation();

  const goProject = (): void => {
    router.push(`/projects/${project.id}`);
  };
  const closeModal = (): void => setModalOpen(false);
  const openModal = (): void => setModalOpen(true);
  const handleAccept = async (): Promise<void> => {
    if (isActive('invite')) {
      return;
    }

    if (currentInvite) {
      const result = await acceptInvite(currentInvite.id);

      if ('data' in result) {
        goProject();
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
    <>
      <div className={styles['project-card']}>
        <div className={styles['project-card__info']}>
          <div className={styles['project-card__header']}>
            <div
              className={`${styles['project-card__image-wrapper']} ${!project.logoUrl ? styles['project-card__image-wrapper--empty'] : ''}`}
            >
              {project.logoUrl ? (
                <Image
                  className={styles['project-card__image']}
                  src={project.logoUrl}
                  alt="logo"
                  width={180}
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
            <div className={styles['project-card__title-wrapper']}>
              <p
                className={`${styles['project-card__status']} ${project.status === 'active' ? styles['project-card__status--active'] : styles['project-card__status--done']}`}
              >
                {project.status === 'active' ? 'Активний' : 'Завершений'}
              </p>
              <h3 className={styles['project-card__title']}>
                {project.projectName}
              </h3>
            </div>
          </div>
          <p className={styles['project-card__description']}>
            {project.description}
          </p>
          <p className={styles['project-card__category']}>
            {project.category.categoryName}
          </p>
          <div className={styles['project-card__footer']}>
            <div className={styles['project-card__team']}>
              <div className={styles['project-card__members']}>
                <Image
                  src="/images/users-2.svg"
                  alt="users"
                  width={24}
                  height={24}
                />
                <span className={styles['project-card__team-text']}>
                  {membersPipe(members.length)}
                </span>
              </div>
              <span className={styles['project-card__team-text']}>
                {datePipe(project.createdAt.toString())}
              </span>
            </div>
            <div className={styles['project-card__vacant-roles']}>
              <p className={styles['project-card__label']}>В пошуку:</p>
              <div className={styles['project-card__roles']}>
                {vacantRolesNames.map((role, index) => (
                  <Fragment key={index}>
                    {index !== 0 && <span>/</span>}
                    <span>{role}</span>
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
        {(isMyProject || project.status === 'active') && (
          <div className={styles['project-card__actions']}>
            {isMyProject && (
              <Button color="green" onClick={goProject}>
                Перейти в кабінет проєкту
              </Button>
            )}
            {isRequest && (
              <Button color="green" disabled>
                Заявку відправлено
              </Button>
            )}
            {isInvite && (
              <>
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
              </>
            )}
            {!isMyProject && !isInvite && !isRequest && (
              <Button color="green">Подати заявку</Button>
            )}
          </div>
        )}
      </div>
      {isModalOpen && currentInvite && (
        <RejectInvitePopup
          onClose={closeModal}
          projectName={project.projectName}
          inviteId={currentInvite.id}
        />
      )}
    </>
  );
}
