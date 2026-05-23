'use client';

import { ReactElement } from 'react';
import Dialog from '@/shared/components/Dialog/Dialog';
import DialogHeader from '@/shared/components/Dialog/DialogHeader/DialogHeader';
import DialogBody from '@/shared/components/Dialog/DialogBody/DialogBody';
import DialogFooter from '@/shared/components/Dialog/DialogFooter/DialogFooter';
import Button from '@/shared/components/Button/Button';
import { ProjectInterface } from '@/shared/interfaces/project.interface';
import { useTranslations } from 'next-intl';
import styles from './LeaveProjectPopup.module.scss';

interface LeaveProjectPopupProps {
  project: ProjectInterface;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function LeaveProjectPopup(
  props: LeaveProjectPopupProps,
): ReactElement {
  const { project, isOpen, onClose, onConfirm, isLoading } = props;
  const tPopup = useTranslations('leaveProjectPopup');
  const tButtons = useTranslations('buttons');

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader title={tPopup('title')} />
      <DialogBody>
        {tPopup.rich('description', {
          project: (chunks) => (
            <span className={styles['leave-project-popup__description']}>
              [{chunks}]
            </span>
          ),
          projectName: project.projectName,
        })}
      </DialogBody>
      <DialogFooter>
        <Button color="green" variant="secondary-frame" onClick={onClose}>
          {tButtons('cancel')}
        </Button>
        <Button color="green" onClick={onConfirm} loading={isLoading}>
          {tButtons('leave')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
