'use client';

import AuthGuard from '@/shared/components/AuthGuard/AuthGuard';
import { ReactElement, Suspense, useEffect, useRef, useState } from 'react';
import styles from './ProfileClient.module.scss';
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
import DiscordBanner from '@/shared/components/DiscordBanner/DiscordBanner';
import { useGetMyInvitesQuery, useGetMyRequestsQuery } from '@/api/usersApi';
import MyRequests from './MyRequests/MyRequests';
import MyInvites from './MyInvites/MyInvites';
import Button from '@/shared/components/Button/Button';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { profileActionTranslationKeys } from '@/shared/constants/profile-action-translation-keys';

export default function ProfileClient(): ReactElement {
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

  const tProfile = useTranslations('profile');
  const tDiscord = useTranslations('discord');

  const handleAddSocial = (): void =>
    setAction({
      type: 'add-social',
      key: profileActionTranslationKeys['add-social'],
    });

  const handleAddEducation = (): void =>
    setAction({
      type: 'add-education',
      key: profileActionTranslationKeys['add-education'],
    });

  const handleAddHardSkill = (): void =>
    setAction({
      type: 'add-hard-skill',
      key: profileActionTranslationKeys['add-hard-skill'],
    });

  const handleAddSoftSkill = (): void =>
    setAction({
      type: 'add-soft-skill',
      key: profileActionTranslationKeys['add-soft-skill'],
    });

  const handleEditSocial = (item: SocialInterface): void =>
    setAction({
      type: 'edit-social',
      key: profileActionTranslationKeys['edit-social'],
      item,
    });

  const handleEditEducation = (item: EducationInterface): void =>
    setAction({
      type: 'edit-education',
      key: profileActionTranslationKeys['edit-education'],
      item,
    });

  const handleEditName = (): void =>
    setAction({
      type: 'edit-name',
      key: profileActionTranslationKeys['edit-name'],
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
        title: `${tProfile('deleteItem.socials.title')}`,
        message: (
          <p className={styles['profile-client__message']}>
            {tProfile('deleteItem.socials.firstPart')}
            <span className={styles['profile-client__message--green']}>
              [{item.network}]
            </span>
            {tProfile('deleteItem.secondPart')}
          </p>
        ),
      });
    }
    if (isEducation(item)) {
      setDeletedItem({
        item,
        title: `${tProfile('deleteItem.educations.title')}`,
        message: (
          <p className={styles['profile-client__message']}>
            {tProfile('deleteItem.educations.firstPart')}
            <span className={styles['profile-client__message--green']}>
              [{item.institution} | {item.specialization}]
            </span>
            {tProfile('deleteItem.secondPart')}
          </p>
        ),
      });
    }
    if (isHardSkill(item)) {
      setDeletedItem({
        item,
        title: `${tProfile('deleteItem.hardSkills.title')}`,
        message: (
          <p className={styles['profile-client__message']}>
            {tProfile('deleteItem.hardSkills.firstPart')}
            <span className={styles['profile-client__message--green']}>
              [{item.hardSkillName}]
            </span>
            {tProfile('deleteItem.secondPart')}
          </p>
        ),
      });
    }
    if (isSoftSkill(item)) {
      setDeletedItem({
        item,
        title: `${tProfile('deleteItem.softSkills.title')}`,
        message: (
          <p className={styles['profile-client__message']}>
            {tProfile('deleteItem.softSkills.firstPart')}
            <span className={styles['profile-client__message--green']}>
              [{item.softSkillName}]
            </span>
            {tProfile('deleteItem.secondPart')}
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
        summary: tProfile('deleteItem.socials.success'),
        life: 3000,
        actionKey: 'delete social',
      });
    }

    if ('error' in result) {
      showToast({
        severity: 'error',
        summary: tProfile('deleteItem.socials.error'),
        detail: tProfile('deleteItem.errorDetails'),
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
        summary: tProfile('deleteItem.educations.success'),
        life: 3000,
        actionKey: 'delete education',
      });
    }

    if ('error' in result) {
      showToast({
        severity: 'error',
        summary: tProfile('deleteItem.educations.error'),
        detail: tProfile('deleteItem.errorDetails'),
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
        summary: tProfile('deleteItem.softSkills.success'),
        life: 3000,
        actionKey: 'delete soft skill',
      });
    }

    if ('error' in result) {
      showToast({
        severity: 'error',
        summary: tProfile('deleteItem.softSkills.error'),
        detail: tProfile('deleteItem.errorDetails'),
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
        summary: tProfile('deleteItem.hardSkills.success'),
        life: 3000,
        actionKey: 'delete hard skill',
      });
    }

    if ('error' in result) {
      showToast({
        severity: 'error',
        summary: tProfile('deleteItem.hardSkills.error'),
        detail: tProfile('deleteItem.errorDetails'),
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
        summary: tProfile('saveChanges'),
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
        <div className={styles['profile-client']}>
          <div className={styles['profile-client__details']}>
            <div className={styles['profile-client__view']}>
              <Button
                color="green"
                variant="secondary-frame"
                onClick={handleRedirect}
              >
                {tProfile('viewProfileBtn')}
              </Button>
            </div>
            <ProfileBaseInfo user={user} handleEditName={handleEditName} />
            <ProfileDetails<SocialInterface>
              title={tProfile('socials')}
              isEditable
              items={socials}
              maxSize={5}
              handleAddItem={handleAddSocial}
              handleEditItem={handleEditSocial}
              handleDeleteItem={openModal}
            />
            <ProfileDetails<EducationInterface>
              title={tProfile('educations')}
              isEditable
              items={educations}
              maxSize={5}
              handleAddItem={handleAddEducation}
              handleEditItem={handleEditEducation}
              handleDeleteItem={openModal}
            />
            <ProfileDetails<HardSkillInterface>
              title={tProfile('hardSkills')}
              items={hardSkills}
              maxSize={20}
              handleAddItem={handleAddHardSkill}
              handleDeleteItem={openModal}
            />
            <ProfileDetails<SoftSkillInterface>
              title={tProfile('softSkills')}
              items={softSkills}
              maxSize={20}
              handleAddItem={handleAddSoftSkill}
              handleDeleteItem={openModal}
            />
          </div>
          <div className={styles['profile-client__actions']} ref={formRef}>
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
            message={tDiscord('profile')}
          />
        )}
      </Suspense>
    </AuthGuard>
  );
}
