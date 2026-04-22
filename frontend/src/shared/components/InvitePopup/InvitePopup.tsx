'use client';

import { ReactElement } from 'react';
import InviteForm from '@/shared/components/InvitePopup/InviteForm/InviteForm';
import { UserCardInterface } from '@/shared/interfaces/user-card.interface';
import { ProjectCardInterface } from '@/shared/interfaces/project-card.interface';
import { useTranslations } from 'next-intl';
import Dialog from '@/shared/components/Dialog/Dialog';
import DialogHeader from '@/shared/components/Dialog/DialogHeader/DialogHeader';
import DialogFooter from '@/shared/components/Dialog/DialogFooter/DialogFooter';

interface InvitePopupProps {
  user: UserCardInterface;
  myProjects: ProjectCardInterface[];
  onClose: () => void;
  isOpen: boolean;
}

export default function InvitePopup(props: InvitePopupProps): ReactElement {
  const { onClose, user, myProjects, isOpen } = props;
  const t = useTranslations('invitePopup');

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader title={t('title')} />
      <DialogFooter>
        <InviteForm onClose={onClose} user={user} myProjects={myProjects} />
      </DialogFooter>
    </Dialog>
  );
}
