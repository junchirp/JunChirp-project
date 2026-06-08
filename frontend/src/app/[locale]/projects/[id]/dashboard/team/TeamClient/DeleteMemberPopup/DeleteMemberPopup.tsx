'use client';

import { ReactElement } from 'react';
import Dialog from '@/shared/components/Dialog/Dialog';
import DialogHeader from '@/shared/components/Dialog/DialogHeader/DialogHeader';
import DialogBody from '@/shared/components/Dialog/DialogBody/DialogBody';
import DialogFooter from '@/shared/components/Dialog/DialogFooter/DialogFooter';
import Button from '@/shared/components/Button/Button';
import styles from './DeleteMemberPopup.module.scss';
import { useTranslations } from 'next-intl';
import { UserCardInterface } from '@/shared/interfaces/user-card.interface';

interface DeleteMemberPopupProps {
  isOpen: boolean;
  onClose: () => void;
  member: UserCardInterface;
  onDelete: (id: string) => void;
  loading: boolean;
}

export default function DeleteMemberPopup(
  props: DeleteMemberPopupProps,
): ReactElement {
  const { isOpen, onClose, member, onDelete, loading } = props;
  const tPopup = useTranslations('deleteMemberPopup');
  const tButtons = useTranslations('buttons');

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader title={tPopup('title')} />
      <DialogBody>
        <div className={styles['delete-member-popup__body']}>
          <p className={styles['delete-member-popup__warning']}>
            {tPopup('warning')}
          </p>
          <p>
            {tPopup.rich('description', {
              user: (chunks) => (
                <span className={styles['delete-member-popup__description']}>
                  [{chunks}]
                </span>
              ),
              firstName: member.firstName,
              lastName: member.lastName,
            })}
          </p>
        </div>
      </DialogBody>
      <DialogFooter>
        <DialogFooter>
          <Button color="green" variant="secondary-frame" onClick={onClose}>
            {tButtons('cancel')}
          </Button>
          <Button
            color="green"
            loading={loading}
            onClick={() => onDelete(member.id)}
          >
            {tButtons('delete')}
          </Button>
        </DialogFooter>
      </DialogFooter>
    </Dialog>
  );
}
