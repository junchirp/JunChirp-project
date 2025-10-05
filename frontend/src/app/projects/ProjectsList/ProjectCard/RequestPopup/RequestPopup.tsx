'use client';

import { ReactElement } from 'react';
import { ProjectCardInterface } from '../../../../../shared/interfaces/project-card.interface';
import styles from './RequestPopup.module.scss';
import RequestForm from './RequestForm/RequestForm';

interface RequestPopupProps {
  onClose: () => void;
  project: ProjectCardInterface;
}

export default function RequestPopup(props: RequestPopupProps): ReactElement {
  const { project, onClose } = props;

  return (
    <div className={styles['request-popup__wrapper']}>
      <div className={styles['request-popup']}>
        <h3 className={styles['request-popup__title']}>
          Подати заявку до проєкту
        </h3>
        <RequestForm onClose={onClose} project={project} />
      </div>
    </div>
  );
}
