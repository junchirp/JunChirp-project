'use client';

import { ReactElement } from 'react';
import styles from './CompleteProjectPopup.module.scss';
import Dialog from '@/shared/components/Dialog/Dialog';
import DialogHeader from '@/shared/components/Dialog/DialogHeader/DialogHeader';
import DialogBody from '@/shared/components/Dialog/DialogBody/DialogBody';
import { useTranslations } from 'next-intl';
import { ProjectInterface } from '@/shared/interfaces/project.interface';
import CompleteProjectForm from './CompleteProjectForm/CompleteProjectForm';
import DialogFooter from '@/shared/components/Dialog/DialogFooter/DialogFooter';

interface CompleteProjectPopupProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectInterface;
}

export default function CompleteProjectPopup(
  props: CompleteProjectPopupProps,
): ReactElement {
  const { isOpen, onClose, project } = props;
  const tPopup = useTranslations('completeProjectPopup');

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader title={tPopup('title')} />
      <DialogBody>
        <p>{tPopup('description')}</p>
        <p>
          {tPopup.rich('warning', {
            project: (chunks) => (
              <span className={styles['complete-project-popup__green-text']}>
                [{chunks}]
              </span>
            ),
            projectName: project.projectName,
          })}
        </p>
      </DialogBody>
      <DialogFooter>
        <CompleteProjectForm id={project.id} onClose={onClose} />
      </DialogFooter>
    </Dialog>
  );
}
