'use client';

import { ReactElement } from 'react';
import styles from './AllFlatList.module.scss';
import {
  TeamAllFlatSectionInterface,
  TeamMemberInterface,
  TeamRequestInterface,
} from '@/shared/interfaces/team-view-interface';
import MembersFlatList from '@/shared/components/MembersFlatList/MembersFlatList';
import VacanciesFlatList from '@/shared/components/VacanciesFlatList/VacanciesFlatList';
import RequestsFlatList from '@/shared/components/RequestsFlatList/RequestsFlatList';
import InvitesFlatList from '@/shared/components/InvitesFlatList/InvitesFlatList';
import { useTranslations } from 'next-intl';
import { TeamTabType } from '@/shared/constants/team';

interface AllFlatListProps {
  items: TeamAllFlatSectionInterface;
  isOwner: boolean;
  tab: TeamTabType;
  roleId: string;
  roleName: string;
  onDeleteMember: (member: TeamMemberInterface) => void;
  onDeleteVacancy: (id: string) => void;
  onDeclineRequest: (request: TeamRequestInterface) => void;
  onAcceptRequest: (requestId: string, userId: string) => void;
  onCancelInvite: (inviteId: string, userId: string) => void;
  onAddVacancy: (id: string) => void;
  inviteLoading: boolean;
  acceptRequestLoading: boolean;
  vacancyLoading: boolean;
}

export default function AllFlatList(props: AllFlatListProps): ReactElement {
  const {
    items,
    isOwner,
    tab,
    roleId,
    roleName,
    onCancelInvite,
    onDeclineRequest,
    onAcceptRequest,
    onDeleteVacancy,
    onDeleteMember,
    onAddVacancy,
    inviteLoading,
    acceptRequestLoading,
    vacancyLoading,
  } = props;
  const t = useTranslations('team');

  return (
    <div className={styles['all-flat-list']}>
      {items.members.length > 0 && (
        <section className={styles['all-flat-list__section']}>
          <h4 className={styles['all-flat-list__title']}>{t('members')}</h4>
          <MembersFlatList
            members={items.members}
            isOwner={isOwner}
            onDelete={onDeleteMember}
          />
        </section>
      )}
      {isOwner && items.requests.length > 0 && (
        <section className={styles['all-flat-list__section']}>
          <h4 className={styles['all-flat-list__title']}>
            {t('participationRequests')}
          </h4>
          <RequestsFlatList
            requests={items.requests}
            onDecline={onDeclineRequest}
            onAccept={onAcceptRequest}
            acceptLoading={acceptRequestLoading}
          />
        </section>
      )}
      {isOwner && items.invitations.length > 0 && (
        <section className={styles['all-flat-list__section']}>
          <h4 className={styles['all-flat-list__title']}>{t('invitations')}</h4>
          <InvitesFlatList
            invites={items.invitations}
            onCancel={onCancelInvite}
            loading={inviteLoading}
          />
        </section>
      )}
      {items.vacancies.length > 0 && (
        <section className={styles['all-flat-list__section']}>
          <h4 className={styles['all-flat-list__title']}>{t('vacancies')}</h4>
          <VacanciesFlatList
            vacancies={items.vacancies}
            isOwner={isOwner}
            tab={tab}
            roleId={roleId}
            roleName={roleName}
            onDelete={onDeleteVacancy}
            onAdd={onAddVacancy}
            loading={vacancyLoading}
          />
        </section>
      )}
    </div>
  );
}
