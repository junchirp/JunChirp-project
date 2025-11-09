'use client';

import AuthGuard from '@/shared/components/AuthGuard/AuthGuard';
import { ReactElement, Suspense, useEffect, useRef, useState } from 'react';
import styles from './page.module.scss';
import ProfileBaseInfo from './ProfileBaseInfo/ProfileBaseInfo';
import authSelector from '@/redux/auth/authSelector';
import ProfileDetails from './ProfileDetails/ProfileDetails';
import { SocialInterface } from '@/shared/interfaces/social.interface';
import { EducationInterface } from '@/shared/interfaces/education.interface';
import { HardSkillInterface } from '@/shared/interfaces/hard-skill.interface';
import { SoftSkillInterface } from '@/shared/interfaces/soft-skill.interface';
import ProfileAction from './ProfileAction/ProfileAction';
import { ProfileActionType } from '@/shared/types/profile-action.type';
import ProfileActionForm from './ProfileActionForm/ProfileActionForm';
import { useDeleteSocialMutation, useGetSocialsQuery } from '@/api/socialsApi';
import DeleteItemPopup from './DeleteItemPopup/DeleteItemPopup';
import {
  isEducation,
  isHardSkill,
  isSocial,
  isSoftSkill,
} from '@/shared/utils/typeGuards';
import { DeletedItemInterface } from '@/shared/interfaces/deleted-item.interface';
import { useToast } from '@/hooks/useToast';
import {
  useDeleteEducationMutation,
  useGetEducationsQuery,
} from '@/api/educationsApi';
import {
  useDeleteSoftSkillMutation,
  useGetSoftSkillsQuery,
} from '@/api/softSkillsApi';
import {
  useDeleteHardSkillMutation,
  useGetHardSkillsQuery,
} from '@/api/hardSkillsApi';
import { useAppSelector } from '@/hooks/reduxHooks';
import DiscordBanner from '../../shared/components/DiscordBanner/DiscordBanner';
import {
  useGetMyInvitesQuery,
  useGetMyRequestsQuery,
} from '../../api/usersApi';
import MyRequests from './MyRequests/MyRequests';
import MyInvites from './MyInvites/MyInvites';
import Button from '../../shared/components/Button/Button';
import { useRouter } from 'next/navigation';

export default function Profile(): ReactElement | null {
  const router = useRouter();
  const [action, setAction] = useState<ProfileActionType>(null);
  const [deletedItem, setDeletedItem] = useState<DeletedItemInterface<
    | SocialInterface
    | EducationInterface
    | SoftSkillInterface
    | HardSkillInterface
  > | null>(null);
  const [deleteSocial, { isLoading: isSocialLoading }] =
    useDeleteSocialMutation();
  const [deleteEducation, { isLoading: isEducationLoading }] =
    useDeleteEducationMutation();
  const [deleteSoftSkill, { isLoading: isSoftSkillLoading }] =
    useDeleteSoftSkillMutation();
  const [deleteHardSkill, { isLoading: isHardSkillLoading }] =
    useDeleteHardSkillMutation();
  const { showToast } = useToast();
  const [isModalOpen, setModalOpen] = useState(false);
  const formRef = useRef<HTMLDivElement | null>(null);
  const user = useAppSelector(authSelector.selectUser);
  const { data: requests = [], isLoading: requestsLoading } =
    useGetMyRequestsQuery(undefined);
  const { data: invites = [], isLoading: invitesLoading } =
    useGetMyInvitesQuery(undefined);
  const { data: socials = [], isLoading: socialsLoading } = useGetSocialsQuery(
    undefined,
    { skip: !user },
  );
  const { data: educations = [], isLoading: educationsLoading } =
    useGetEducationsQuery(undefined, {
      skip: !user,
    });
  const { data: softSkills = [], isLoading: softSkillsLoading } =
    useGetSoftSkillsQuery(undefined, {
      skip: !user,
    });
  const { data: hardSkills = [], isLoading: hardSkillsLoading } =
    useGetHardSkillsQuery(undefined, {
      skip: !user,
    });
  const [isBanner, setBanner] = useState(false);
  const desiredRoles = user?.desiredRoles ?? [];
  const isLoading =
    socialsLoading ||
    softSkillsLoading ||
    hardSkillsLoading ||
    educationsLoading ||
    requestsLoading ||
    invitesLoading;

  const allFilled = [
    socials,
    educations,
    softSkills,
    hardSkills,
    desiredRoles,
  ].every((arr) => arr.length > 0);

  useEffect(() => {
    if (action && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [action]);

  useEffect(() => {
    if (user && !user.discordId) {
      setBanner(true);
    }
  }, [user]);

  const handleAddSocial = (): void =>
    setAction({ type: 'add-social', description: 'Додати соцмережу' });
  const handleAddEducation = (): void =>
    setAction({ type: 'add-education', description: 'Додати освіту' });
  const handleAddHardSkill = (): void =>
    setAction({ type: 'add-hard-skill', description: 'Додати хард скіл' });
  const handleAddSoftSkill = (): void =>
    setAction({ type: 'add-soft-skill', description: 'Додати софт скіл' });
  const handleEditSocial = (item: SocialInterface): void =>
    setAction({
      type: 'edit-social',
      item,
      description: 'Редагувати соцмережу',
    });
  const handleEditEducation = (item: EducationInterface): void =>
    setAction({
      type: 'edit-education',
      item,
      description: 'Редагувати освіту',
    });
  const handleEditName = (): void =>
    setAction({
      type: 'edit-name',
      description: 'Редагувати особисту інформацію',
    });
  const handleCancel = (): void => setAction(null);
  const closeModal = (): void => {
    setModalOpen(false);
    setDeletedItem(null);
  };
  const openModal = (
    item:
      | SocialInterface
      | EducationInterface
      | SoftSkillInterface
      | HardSkillInterface,
  ): void => {
    setModalOpen(true);
    if (isSocial(item)) {
      setDeletedItem({
        item,
        title: 'Видалити соцмережу?',
        message: (
          <p className={styles.profile__message}>
            Ти дійсно хочеш видалити соцмережу{' '}
            <span className={styles['profile__message--green']}>
              [{item.network}]
            </span>
            ? Дію неможливо скасувати.
          </p>
        ),
      });
    }
    if (isEducation(item)) {
      setDeletedItem({
        item,
        title: 'Видалити запис про освіту?',
        message: (
          <p className={styles.profile__message}>
            Ти дійсно хочеш видалити запис про освіту{' '}
            <span className={styles['profile__message--green']}>
              [{item.institution} | {item.specialization}]
            </span>
            ? Дію неможливо скасувати.
          </p>
        ),
      });
    }
    if (isHardSkill(item)) {
      setDeletedItem({
        item,
        title: 'Видалити навичку?',
        message: (
          <p className={styles.profile__message}>
            Ти дійсно хочеш видалити хард скіл{' '}
            <span className={styles['profile__message--green']}>
              [{item.hardSkillName}]
            </span>
            ? Дію неможливо скасувати.
          </p>
        ),
      });
    }
    if (isSoftSkill(item)) {
      setDeletedItem({
        item,
        title: 'Видалити навичку?',
        message: (
          <p className={styles.profile__message}>
            Ти дійсно хочеш видалити софт скіл{' '}
            <span className={styles['profile__message--green']}>
              [{item.softSkillName}]
            </span>
            ? Дію неможливо скасувати.
          </p>
        ),
      });
    }
  };

  const handleDeleteSocial = async (item: SocialInterface): Promise<void> => {
    const result = await deleteSocial(item.id);
    closeModal();

    if ('data' in result) {
      showToast({
        severity: 'success',
        summary: 'Соцмережу видалено.',
        life: 3000,
        actionKey: 'delete social',
      });
    }

    if ('error' in result) {
      showToast({
        severity: 'error',
        summary: 'Не вдалося видалити соцмережу. Спробуй пізніше.',
        life: 3000,
        actionKey: 'delete social',
      });
    }
  };

  const handleDeleteEducation = async (
    item: EducationInterface,
  ): Promise<void> => {
    const result = await deleteEducation(item.id);
    closeModal();

    if ('data' in result) {
      showToast({
        severity: 'success',
        summary: 'Запис про освіту видалено.',
        life: 3000,
        actionKey: 'delete education',
      });
    }

    if ('error' in result) {
      showToast({
        severity: 'error',
        summary: 'Не вдалося видалити запис про освіту. Спробуй пізніше.',
        life: 3000,
        actionKey: 'delete education',
      });
    }
  };

  const handleDeleteSoftSkill = async (
    item: SoftSkillInterface,
  ): Promise<void> => {
    const result = await deleteSoftSkill(item.id);
    closeModal();

    if ('data' in result) {
      showToast({
        severity: 'success',
        summary: 'Софт скіл видалено.',
        life: 3000,
        actionKey: 'delete soft skill',
      });
    }

    if ('error' in result) {
      showToast({
        severity: 'error',
        summary: 'Не вдалося видалити софт скіл. Спробуй пізніше.',
        life: 3000,
        actionKey: 'delete soft skill',
      });
    }
  };

  const handleDeleteHardSkill = async (
    item: HardSkillInterface,
  ): Promise<void> => {
    const result = await deleteHardSkill(item.id);
    closeModal();

    if ('data' in result) {
      showToast({
        severity: 'success',
        summary: 'Хард скіл видалено.',
        life: 3000,
        actionKey: 'delete hard skill',
      });
    }

    if ('error' in result) {
      showToast({
        severity: 'error',
        summary: 'Не вдалося видалити хард скіл. Спробуй пізніше.',
        life: 3000,
        actionKey: 'delete hard skill',
      });
    }
  };

  const closeBanner = (): void => {
    setBanner(false);
  };

  const handleRedirect = (): void => {
    if (action) {
      showToast({
        severity: 'error',
        summary: 'Збережи зміни перед переглядом.',
        life: 3000,
        actionKey: 'view profile',
      });
    } else {
      router.push(`/users/${user?.id}`);
    }
  };

  return (
    <AuthGuard requireVerified>
      {user && !isLoading && (
        <div className={styles.profile}>
          <div className={styles.profile__details}>
            <div className={styles.profile__view}>
              <Button color="green" onClick={handleRedirect}>
                Переглянути профіль
              </Button>
            </div>
            <ProfileBaseInfo user={user} handleEditName={handleEditName} />
            <ProfileDetails<SocialInterface>
              title="Соцмережі"
              isEditable
              items={socials}
              maxSize={5}
              handleAddItem={handleAddSocial}
              handleEditItem={handleEditSocial}
              handleDeleteItem={openModal}
            />
            <ProfileDetails<EducationInterface>
              title="Освіта"
              isEditable
              items={educations}
              maxSize={5}
              handleAddItem={handleAddEducation}
              handleEditItem={handleEditEducation}
              handleDeleteItem={openModal}
            />
            <ProfileDetails<HardSkillInterface>
              title="Хард скіли"
              items={hardSkills}
              maxSize={20}
              handleAddItem={handleAddHardSkill}
              handleDeleteItem={openModal}
            />
            <ProfileDetails<SoftSkillInterface>
              title="Софт скіли"
              items={softSkills}
              maxSize={20}
              handleAddItem={handleAddSoftSkill}
              handleDeleteItem={openModal}
            />
          </div>
          <div className={styles.profile__actions} ref={formRef}>
            <ProfileAction action={action} />
            <ProfileActionForm
              user={user}
              action={action}
              allField={allFilled}
              onCancel={handleCancel}
            />
          </div>
          {!!requests.length && user && (
            <MyRequests requests={requests} user={user} />
          )}
          {!!invites.length && <MyInvites invites={invites} user={user} />}
        </div>
      )}
      {isModalOpen && deletedItem && isSocial(deletedItem.item) && (
        <DeleteItemPopup<SocialInterface>
          item={deletedItem.item}
          onCancel={closeModal}
          onConfirm={handleDeleteSocial}
          title={deletedItem.title}
          message={deletedItem.message}
          loading={isSocialLoading}
        />
      )}
      {isModalOpen && isEducation(deletedItem?.item) && (
        <DeleteItemPopup<EducationInterface>
          item={deletedItem.item}
          onCancel={closeModal}
          onConfirm={handleDeleteEducation}
          title={deletedItem.title}
          message={deletedItem.message}
          loading={isEducationLoading}
        />
      )}
      {isModalOpen && isSoftSkill(deletedItem?.item) && (
        <DeleteItemPopup<SoftSkillInterface>
          item={deletedItem.item}
          onCancel={closeModal}
          onConfirm={handleDeleteSoftSkill}
          title={deletedItem.title}
          message={deletedItem.message}
          loading={isSoftSkillLoading}
        />
      )}
      {isModalOpen && isHardSkill(deletedItem?.item) && (
        <DeleteItemPopup<HardSkillInterface>
          item={deletedItem.item}
          onCancel={closeModal}
          onConfirm={handleDeleteHardSkill}
          title={deletedItem.title}
          message={deletedItem.message}
          loading={isHardSkillLoading}
        />
      )}
      <Suspense fallback={null}>
        {isBanner && (
          <DiscordBanner
            closeBanner={closeBanner}
            message="Підключи Discord, щоб мати змогу приєднуватися до проєктів та отримати
        доступ до проєктних чатів."
          />
        )}
      </Suspense>
    </AuthGuard>
  );
}
