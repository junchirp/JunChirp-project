'use client';

import { Fragment, ReactElement, useState } from 'react';
import styles from './ProjectCard.module.scss';
import { ProjectCardInterface } from '@/shared/interfaces/project-card.interface';
import Button from '../../../../shared/components/Button/Button';
import Image from 'next/image';
import { membersPipe } from '../../../../shared/utils/membersPipe';
import { datePipe } from '../../../../shared/utils/datePipe';
import { useRouter } from 'next/navigation';
import RejectInvitePopup from '../../../../shared/components/RejectInvitePopup/RejectInvitePopup';
import { ProjectParticipationInterface } from '../../../../shared/interfaces/project-participation.interface';
import {
  useAcceptInviteMutation,
  useCreateRequestMutation,
} from '../../../../api/participationsApi';
import DiscordBanner from '../../../../shared/components/DiscordBanner/DiscordBanner';
import Link from 'next/link';
import { UserInterface } from '../../../../shared/interfaces/user.interface';
import { ProjectRoleInterface } from '../../../../shared/interfaces/project-role.interface';
import RadioGroup from '../../../../shared/components/RadioGroup/RadioGroup';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { requestSchema } from '../../../../shared/forms/schemas/requestSchema';
import { useToast } from '../../../../hooks/useToast';
import { useAppSelector } from '../../../../hooks/reduxHooks';
import { selectAllEducations } from '../../../../redux/educations/educationsSlice';

interface ProjectCardProps {
  project: ProjectCardInterface;
  invites: ProjectParticipationInterface[];
  requests: ProjectParticipationInterface[];
  user: UserInterface | null;
}

type FormData = z.infer<typeof requestSchema>;

export default function ProjectCard({
  project,
  invites,
  requests,
  user,
}: ProjectCardProps): ReactElement {
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<FormData>({
    resolver: zodResolver(requestSchema),
    mode: 'onChange',
    defaultValues: {
      projectId: project.id,
      projectRoleId: '',
      userId: user?.id ?? '',
    },
  });
  const router = useRouter();
  const [createRequest] = useCreateRequestMutation();
  const { showToast, isActive } = useToast();
  const educations = useAppSelector(selectAllEducations);
  const currentInvite = invites.find(
    (invite) => invite.projectRole.project.id === project.id,
  );
  const isInvite = !!currentInvite;
  const currentRequest = requests.find(
    (req) => req.projectRole.project.id === project.id,
  );
  const isRequest = !!currentRequest;
  const vacantRoles: ProjectRoleInterface[] = project.roles
    .filter((role) => !role.user)
    .map((role) => ({ id: role.id, roleType: role.roleType }));
  const members = project.roles
    .map((role) => role.user)
    .filter((member) => member !== null);
  const isMyProject = members.some((member) => member.id === user?.id);
  const [isInvitePopupOpen, setInvitePopupOpen] = useState(false);
  const [acceptInvite] = useAcceptInviteMutation();
  const [isInviteBanner, setInviteBanner] = useState(false);
  const [isRequestBanner, setRequestBanner] = useState(false);
  const roleTypeIds = educations.map((edu) => edu.specialization.id) ?? [];

  const goProject = (): void => {
    router.push(`/projects/${project.id}`);
  };
  const closeInvitePopup = (): void => setInvitePopupOpen(false);
  const openInvitePopup = (): void => setInvitePopupOpen(true);
  const closeInviteBanner = (): void => setInviteBanner(false);
  const closeRequestBanner = (): void => setRequestBanner(false);

  const handleAccept = async (): Promise<void> => {
    if (!user?.discordId) {
      setInviteBanner(true);
      return;
    }

    if (currentInvite) {
      const result = await acceptInvite(currentInvite.id);

      if ('data' in result) {
        goProject();
      }
    }
  };

  const sendRequest = async (data: FormData): Promise<void> => {
    if (!user?.discordId) {
      setRequestBanner(true);
      return;
    }

    if (isActive('request')) {
      return;
    }

    const result = await createRequest(data);

    if ('data' in result) {
      showToast({
        severity: 'success',
        summary: 'Запит на участь в проєкті надіслано успішно!',
        life: 3000,
        actionKey: 'request',
      });
    } else if ('error' in result) {
      showToast({
        severity: 'error',
        summary: 'Не вдалося надіслати заявку.',
        detail: 'Спробуй пізніше.',
        life: 3000,
        actionKey: 'request',
      });
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
              <Link
                className={styles['project-card__title']}
                href={`/projects/${project.id}`}
              >
                {project.projectName}
              </Link>
            </div>
          </div>
          <p className={styles['project-card__description']}>
            {project.description}
          </p>
          <p className={styles['project-card__category']}>
            {project.category.categoryName}
          </p>
          <div className={styles['project-card__team']}>
            <div className={styles['project-card__members']}>
              <Image
                src="/images/users-2.svg"
                alt="users"
                width={24}
                height={24}
              />
              <span className={styles['project-card__team-text']}>
                {membersPipe(project.participantsCount)}
              </span>
            </div>
            <span className={styles['project-card__team-text']}>
              {datePipe(project.createdAt.toString())}
            </span>
          </div>
        </div>
        {(isMyProject || project.status === 'active') && (
          <div className={styles['project-card__footer']}>
            {isMyProject && (
              <>
                {vacantRoles.length ? (
                  <div className={styles['project-card__vacant-roles']}>
                    <p className={styles['project-card__label']}>В пошуку:</p>
                    <div className={styles['project-card__roles']}>
                      {vacantRoles.map((role, index) => (
                        <Fragment key={index}>
                          {index !== 0 && (
                            <span className={styles['project-card__role']}>
                              /
                            </span>
                          )}
                          <span className={styles['project-card__role']}>
                            {role.roleType.roleName}
                          </span>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                ) : null}
                <div
                  className={`${styles['project-card__actions']} ${!vacantRoles.length ? styles['project-card__actions--empty'] : ''}`}
                >
                  <Button color="green" onClick={goProject}>
                    Перейти в кабінет проєкту
                  </Button>
                </div>
              </>
            )}
            {isRequest && (
              <>
                <div className={styles['project-card__vacant-roles']}>
                  <p className={styles['project-card__label']}>В пошуку:</p>
                  <div className={styles['project-card__roles']}>
                    {vacantRoles.map((role, index) => (
                      <Fragment key={role.id}>
                        {index !== 0 && (
                          <span className={styles['project-card__role']}>
                            /
                          </span>
                        )}
                        {role.roleType.id ===
                        currentRequest.projectRole.roleType.id ? (
                          <span
                            className={`${styles['project-card__role']} ${styles['project-card__role--green']}`}
                          >
                            [{role.roleType.roleName}]
                          </span>
                        ) : (
                          <span className={styles['project-card__role']}>
                            {role.roleType.roleName}
                          </span>
                        )}
                      </Fragment>
                    ))}
                  </div>
                </div>
                <div className={styles['project-card__actions']}>
                  <Button color="green" disabled>
                    Заявка подана
                  </Button>
                </div>
              </>
            )}
            {isInvite && (
              <>
                <div className={styles['project-card__vacant-roles']}>
                  <p className={styles['project-card__label']}>В пошуку:</p>
                  <div className={styles['project-card__roles']}>
                    {vacantRoles.map((role, index) => (
                      <Fragment key={role.id}>
                        {index !== 0 && (
                          <span className={styles['project-card__role']}>
                            /
                          </span>
                        )}
                        {role.roleType.id ===
                        currentInvite.projectRole.roleType.id ? (
                          <span
                            className={`${styles['project-card__role']} ${styles['project-card__role--green']}`}
                          >
                            [{role.roleType.roleName}]
                          </span>
                        ) : (
                          <span className={styles['project-card__role']}>
                            {role.roleType.roleName}
                          </span>
                        )}
                      </Fragment>
                    ))}
                  </div>
                </div>
                <div className={styles['project-card__actions']}>
                  <Button
                    color="red"
                    variant="secondary-frame"
                    onClick={openInvitePopup}
                  >
                    Відхилити
                  </Button>
                  <Button color="green" onClick={handleAccept}>
                    Прийняти
                  </Button>
                </div>
              </>
            )}
            {!isMyProject && !isInvite && !isRequest && (
              <form
                className={styles['project-card__form']}
                onSubmit={handleSubmit(sendRequest)}
              >
                <div className={styles['project-card__form-inner']}>
                  <p className={styles['project-card__label']}>В пошуку:</p>
                  <Controller
                    name="projectRoleId"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        {...field}
                        options={vacantRoles}
                        name="roles"
                        roleTypeIds={roleTypeIds}
                      />
                    )}
                  />
                </div>
                <div className={styles['project-card__actions']}>
                  <Button color="green" type="submit" disabled={!isValid}>
                    Подати заявку
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
      {isInvitePopupOpen && currentInvite && user && (
        <RejectInvitePopup
          onClose={closeInvitePopup}
          projectName={project.projectName}
          inviteId={currentInvite.id}
          user={user}
        />
      )}
      {isInviteBanner && (
        <DiscordBanner
          closeBanner={closeInviteBanner}
          message="Підключи Discord, щоб прийняти запрошення. Це дозволить отримати доступ до проєктного чату."
          isCancelButton
          withWrapper
        />
      )}
      {isRequestBanner && (
        <DiscordBanner
          closeBanner={closeRequestBanner}
          message="Підключи Discord, щоб подати заявку. Це дозволить отримати доступ до проєктного чату після прийняття."
          isCancelButton
          withWrapper
        />
      )}
    </>
  );
}
