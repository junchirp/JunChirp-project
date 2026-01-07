'use client';

import { Fragment, ReactElement, useState } from 'react';
import styles from './ProjectCard.module.scss';
import { ProjectCardInterface } from '@/shared/interfaces/project-card.interface';
import Button from '@/shared/components/Button/Button';
import Image from 'next/image';
import { membersPipe } from '@/shared/utils/membersPipe';
import { datePipe } from '@/shared/utils/datePipe';
import { useRouter } from 'next/navigation';
import RejectInvitePopup from '@/shared/components/RejectInvitePopup/RejectInvitePopup';
import { ProjectParticipationInterface } from '@/shared/interfaces/project-participation.interface';
import {
  useAcceptInviteMutation,
  useCancelRequestMutation,
  useCreateRequestMutation,
} from '@/api/participationsApi';
import DiscordBanner from '@/shared/components/DiscordBanner/DiscordBanner';
import { Link, Locale } from '@/i18n/routing';
import { AuthInterface } from '@/shared/interfaces/auth.interface';
import { ProjectRoleInterface } from '@/shared/interfaces/project-role.interface';
import RadioGroup from '@/shared/components/RadioGroup/RadioGroup';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  requestSchema,
  requestSchemaStatic,
} from '@/shared/forms/schemas/requestSchema';
import { useToast } from '@/hooks/useToast';
import { useLocale, useTranslations } from 'next-intl';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { projectDurationPipe } from '@/shared/utils/projectDurationPipe';

interface ProjectCardProps {
  project: ProjectCardInterface;
  invites: ProjectParticipationInterface[];
  requests: ProjectParticipationInterface[];
  user: AuthInterface | null;
  size?: 'small' | 'large';
}

type FormData = z.infer<typeof requestSchemaStatic>;

export default function ProjectCard({
  project,
  invites,
  requests,
  user,
  size = 'small',
}: ProjectCardProps): ReactElement {
  const tForm = useTranslations('forms');
  const tStatus = useTranslations('status');
  const tDiscord = useTranslations('discord');
  const tButtons = useTranslations('buttons');
  const tProjectsPage = useTranslations('projectsPage');
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<FormData>({
    resolver: zodResolver(requestSchema(tForm)),
    mode: 'onChange',
    defaultValues: {
      projectId: project.id,
      projectRoleId: '',
      userId: user?.id ?? '',
    },
  });
  const router = useRouter();
  const [createRequest, { isLoading: requestLoading }] =
    useCreateRequestMutation();
  const { showToast, isActive } = useToast();
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
  const [acceptInvite, { isLoading: inviteLoading }] =
    useAcceptInviteMutation();
  const [isInviteBanner, setInviteBanner] = useState(false);
  const [isRequestBanner, setRequestBanner] = useState(false);
  const roleTypeIds = user?.desiredRoles.map((role) => role.id) ?? [];
  const locale = useLocale();
  const [cancelRequest, { isLoading: cancelRequestLoading }] =
    useCancelRequestMutation();

  const goProject = (): void => {
    if (isMyProject) {
      router.push(`/projects/${project.id}/cab`);
    } else {
      router.push(`/projects/${project.id}`);
    }
  };

  const viewWebSite = (): void => {
    if (project.publicUrl) {
      window.open(project.publicUrl, '_blank');
    }
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

    if (isActive('invite')) {
      return;
    }

    if (currentInvite) {
      const result = await acceptInvite(currentInvite.id);

      if ('error' in result) {
        const errorData = result.error as
          | ((FetchBaseQueryError | SerializedError) & {
              status: number;
            })
          | undefined;
        const status = errorData?.status;

        if (status === 400) {
          showToast({
            severity: 'error',
            summary: tProjectsPage('invite.error400'),
            life: 3000,
            actionKey: 'invite',
          });
        } else {
          showToast({
            severity: 'error',
            summary: tProjectsPage('invite.error'),
            detail: tProjectsPage('invite.errorDetails'),
            life: 3000,
            actionKey: 'invite',
          });
        }
      }

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

    const result = await createRequest({ ...data, locale: locale as Locale });

    if ('error' in result) {
      const errorData = result.error as
        | ((FetchBaseQueryError | SerializedError) & {
            status: number;
          })
        | undefined;
      const status = errorData?.status;

      if (status === 400) {
        showToast({
          severity: 'error',
          summary: tProjectsPage('request.error400'),
          life: 3000,
          actionKey: 'request',
        });
      } else {
        showToast({
          severity: 'error',
          summary: tProjectsPage('request.error'),
          detail: tProjectsPage('request.errorDetails'),
          life: 3000,
          actionKey: 'request',
        });
      }
    }

    if ('data' in result) {
      showToast({
        severity: 'success',
        summary: tProjectsPage('request.success'),
        life: 3000,
        actionKey: 'request',
      });
    }
  };

  const handleCancelRequest = async (): Promise<void> => {
    if (currentRequest) {
      if (isActive('cancel-request')) {
        return;
      }

      const result = await cancelRequest({
        id: currentRequest.id,
        userId: user?.id ?? '',
      });

      if ('error' in result) {
        showToast({
          severity: 'error',
          summary: tProjectsPage('request.cancelError'),
          detail: tProjectsPage('request.errorDetails'),
          life: 3000,
          actionKey: 'cancel-request',
        });
      }

      if ('data' in result) {
        showToast({
          severity: 'success',
          summary: tProjectsPage('request.cancelSuccess'),
          life: 3000,
          actionKey: 'cancel-request',
        });
      }
    }
  };

  return (
    <>
      {!isMyProject || size === 'small' ? (
        <>
          <div
            className={`
              ${styles['project-card']} 
              ${size === 'small' ? styles['project-card--small'] : styles['project-card--large']}
            `}
          >
            <div
              className={`
                ${styles['project-card__image-wrapper']} 
                ${!project.logoUrl ? styles['project-card__image-wrapper--empty'] : ''} 
                ${size === 'small' ? styles['project-card__image-wrapper--small'] : styles['project-card__image-wrapper--large']}
              `}
            >
              {project.logoUrl ? (
                <Image
                  className={styles['project-card__image']}
                  src={project.logoUrl}
                  alt="logo"
                  width={180}
                  height={0}
                  unoptimized
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
            <div
              className={`
                ${styles['project-card__title-wrapper']} 
                ${size === 'small' ? styles['project-card__title-wrapper--small'] : styles['project-card__title-wrapper--large']}
              `}
            >
              <p
                className={`
                  ${styles['project-card__status']} 
                  ${project.status === 'active' ? styles['project-card__status--active'] : styles['project-card__status--done']}
                  ${size === 'small' ? styles['project-card__status--small'] : styles['project-card__status--large']}
                `}
              >
                {project.status === 'active'
                  ? tStatus('active')
                  : tStatus('completed')}
              </p>
              {size === 'small' ? (
                <Link
                  className={styles['project-card__link']}
                  href={
                    isMyProject
                      ? `/projects/${project.id}/cab`
                      : `/projects/${project.id}`
                  }
                >
                  {project.projectName}
                </Link>
              ) : (
                <h2 className={styles['project-card__title']}>
                  {project.projectName}
                </h2>
              )}
            </div>
            <div
              className={`
                ${styles['project-card__details']} 
                ${size === 'small' ? styles['project-card__details--small'] : styles['project-card__details--large']}
              `}
            >
              <div className={styles['project-card__info']}>
                <p
                  className={`
                    ${styles['project-card__description']}
                    ${size === 'small' ? styles['project-card__description--small'] : styles['project-card__description--large']}
                  `}
                >
                  {project.description}
                </p>
                <p
                  className={`
                    ${styles['project-card__category']}
                    ${size === 'small' ? styles['project-card__category--small'] : styles['project-card__category--large']}
                  `}
                >
                  {project.category.categoryName[locale as Locale]}
                </p>
                <div
                  className={`
                    ${styles['project-card__team']}
                    ${size === 'small' ? styles['project-card__team--small'] : styles['project-card__team--large']}
                  `}
                >
                  <div className={styles['project-card__members']}>
                    <Image
                      src="/images/users-2.svg"
                      alt="users"
                      width={24}
                      height={24}
                    />
                    <span
                      className={`
                        ${styles['project-card__team-text']}
                        ${size === 'small' ? styles['project-card__team-text--small'] : styles['project-card__team-text--large']}
                      `}
                    >
                      {membersPipe(project.participantsCount, tProjectsPage)}
                    </span>
                  </div>
                  <span
                    className={`
                      ${styles['project-card__team-text']}
                      ${size === 'small' ? styles['project-card__team-text--small'] : styles['project-card__team-text--large']}
                    `}
                  >
                    {datePipe(project.createdAt.toString(), 'DD/MM/YYYY')}
                  </span>
                </div>
                {project.duration !== null && project.status === 'done' && (
                  <p
                    className={`
                      ${styles['project-card__duration']}
                      ${size === 'small' ? styles['project-card__duration--small'] : styles['project-card__duration--large']}
                    `}
                  >
                    <span>{tProjectsPage('duration.title')}:</span>
                    <span
                      className={`
                      ${styles['project-card__duration-value']}
                      ${size === 'small' ? styles['project-card__duration-value--small'] : styles['project-card__duration-value--large']}
                    `}
                    >
                      {projectDurationPipe(project.duration, tProjectsPage)}
                    </span>
                  </p>
                )}
              </div>
              {(isMyProject || project.status === 'active') && (
                <div className={styles['project-card__footer']}>
                  {isMyProject && (
                    <>
                      {vacantRoles.length ? (
                        <div
                          className={`
                            ${styles['project-card__vacant-roles']}
                            ${size === 'small' ? styles['project-card__vacant-roles--small'] : styles['project-card__vacant-roles--large']}
                          `}
                        >
                          <p
                            className={`
                              ${styles['project-card__label']}
                              ${size === 'small' ? styles['project-card__label--small'] : styles['project-card__label--large']}
                            `}
                          >
                            {tForm('requestForm.field')}:
                          </p>
                          <div className={styles['project-card__roles']}>
                            {vacantRoles.map((role, index) => (
                              <Fragment key={index}>
                                {index !== 0 && (
                                  <span
                                    className={styles['project-card__role']}
                                  >
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
                        className={`
                          ${styles['project-card__actions']} 
                          ${!vacantRoles.length ? styles['project-card__actions--empty'] : ''}
                          ${size === 'small' ? styles['project-card__actions--small'] : styles['project-card__actions--large']}
                        `}
                      >
                        <Button color="green" onClick={goProject}>
                          {tButtons('goDashboard')}
                        </Button>
                      </div>
                    </>
                  )}
                  {isRequest && (
                    <>
                      <div
                        className={`
                          ${styles['project-card__vacant-roles']}
                          ${size === 'small' ? styles['project-card__vacant-roles--small'] : styles['project-card__vacant-roles--large']}
                        `}
                      >
                        <p
                          className={`
                            ${styles['project-card__label']}
                            ${size === 'small' ? styles['project-card__label--small'] : styles['project-card__label--large']}
                          `}
                        >
                          {tForm('requestForm.field')}:
                        </p>
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
                      <div
                        className={`
                          ${styles['project-card__actions']} 
                          ${!vacantRoles.length ? styles['project-card__actions--empty'] : ''}
                          ${size === 'small' ? styles['project-card__actions--small'] : styles['project-card__actions--large']}
                        `}
                      >
                        <Button
                          color="green"
                          loading={cancelRequestLoading}
                          onClick={handleCancelRequest}
                        >
                          {tButtons('cancelRequest')}
                        </Button>
                      </div>
                    </>
                  )}
                  {isInvite && (
                    <>
                      <div
                        className={`
                          ${styles['project-card__vacant-roles']}
                          ${size === 'small' ? styles['project-card__vacant-roles--small'] : styles['project-card__vacant-roles--large']}
                        `}
                      >
                        <p
                          className={`
                            ${styles['project-card__label']}
                            ${size === 'small' ? styles['project-card__label--small'] : styles['project-card__label--large']}
                          `}
                        >
                          {tForm('requestForm.field')}:
                        </p>
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
                      <div
                        className={`
                          ${styles['project-card__actions']} 
                          ${!vacantRoles.length ? styles['project-card__actions--empty'] : ''}
                          ${size === 'small' ? styles['project-card__actions--small'] : styles['project-card__actions--large']}
                        `}
                      >
                        <Button
                          color="red"
                          variant="secondary-frame"
                          onClick={openInvitePopup}
                        >
                          {tButtons('decline')}
                        </Button>
                        <Button
                          color="green"
                          onClick={handleAccept}
                          loading={inviteLoading}
                        >
                          {tButtons('accept')}
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
                        {vacantRoles.length ? (
                          <p
                            className={`
                            ${styles['project-card__label']}
                            ${size === 'small' ? styles['project-card__label--small'] : styles['project-card__label--large']}
                          `}
                          >
                            {tForm('requestForm.field')}:
                          </p>
                        ) : null}
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
                      <div
                        className={`
                          ${styles['project-card__actions']}
                          ${!vacantRoles.length ? styles['project-card__actions--empty'] : ''}
                          ${size === 'small' ? styles['project-card__actions--small'] : styles['project-card__actions--large']}
                        `}
                      >
                        <Button
                          color="green"
                          type="submit"
                          disabled={!isValid || !vacantRoles.length}
                          loading={requestLoading}
                        >
                          {tButtons('sendRequest')}
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              )}
              {!isMyProject &&
                project.status === 'done' &&
                project.publicUrl && (
                  <div className={styles['project-card__footer']}>
                    <div
                      className={`
                          ${styles['project-card__actions']} 
                          ${!vacantRoles.length ? styles['project-card__actions--empty'] : ''}
                          ${size === 'small' ? styles['project-card__actions--small'] : styles['project-card__actions--large']}
                        `}
                    >
                      <Button color="green" onClick={viewWebSite}>
                        {tButtons('viewWebSite')}
                      </Button>
                    </div>
                  </div>
                )}
            </div>
          </div>
          {isInvitePopupOpen && currentInvite && user && (
            <RejectInvitePopup
              onClose={closeInvitePopup}
              invite={currentInvite}
              user={user}
            />
          )}
          {isInviteBanner && (
            <DiscordBanner
              closeBanner={closeInviteBanner}
              message={tDiscord('invite')}
              isCancelButton
              withWrapper
            />
          )}
          {isRequestBanner && (
            <DiscordBanner
              closeBanner={closeRequestBanner}
              message={tDiscord('request')}
              isCancelButton
              withWrapper
            />
          )}
        </>
      ) : null}
    </>
  );
}
