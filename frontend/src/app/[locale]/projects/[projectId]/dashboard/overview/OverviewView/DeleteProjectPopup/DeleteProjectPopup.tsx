'use client';

import { ReactElement } from 'react';
import styles from './DeletePrijectPopup.module.scss';
import Dialog from '@/shared/components/Dialog/Dialog';
import { ProjectInterface } from '@/shared/interfaces/project.interface';
import DialogHeader from '@/shared/components/Dialog/DialogHeader/DialogHeader';
import DialogBody from '@/shared/components/Dialog/DialogBody/DialogBody';
import { useTranslations } from 'next-intl';
import DialogFooter from '@/shared/components/Dialog/DialogFooter/DialogFooter';
import Button from '@/shared/components/Button/Button';

interface DeleteProjectPopupProps {
  project: ProjectInterface;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function DeleteProjectPopup(
  props: DeleteProjectPopupProps,
): ReactElement {
  const { project, isOpen, onClose, onConfirm, isLoading } = props;
  const tPopup = useTranslations('deleteProjectPopup');
  const tButtons = useTranslations('buttons');

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader title={tPopup('title')} />
      <DialogBody>
        <div className={styles['delete-project-popup__body']}>
          <p className={styles['delete-project-popup__warning']}>
            {tPopup('warning')}
          </p>
          <p>
            {tPopup.rich('description', {
              project: (chunks) => (
                <span className={styles['delete-project-popup__description']}>
                  [{chunks}]
                </span>
              ),
              projectName: project.projectName,
            })}
          </p>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button color="green" variant="secondary-frame" onClick={onClose}>
          {tButtons('cancel')}
        </Button>
        <Button color="green" loading={isLoading} onClick={() => onConfirm()}>
          {tButtons('delete')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
