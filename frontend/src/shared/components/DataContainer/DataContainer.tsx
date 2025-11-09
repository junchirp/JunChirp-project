import { ReactElement, ReactNode } from 'react';
import styles from './DataContainer.module.scss';

interface DataContainerProps {
  title: string;
  counterSize?: number;
  counterMaxSize?: number;
  verticalGap?: number;
  children?: ReactNode;
}

export default function DataContainer({
  title,
  counterSize,
  counterMaxSize,
  verticalGap = 32,
  children,
}: DataContainerProps): ReactElement {
  return (
    <div
      className={styles['data-container']}
      style={{ gap: `${verticalGap}px` }}
    >
      <div className={styles['data-container__header']}>
        <div className={styles['data-container__title-wrapper']}>
          <div className={styles['data-container__title']}>{title}</div>
          {!!counterMaxSize && (
            <div className={styles['data-container__counter']}>
              {counterSize}{' '}
              <span className={styles['data-container__total']}>
                / {counterMaxSize}
              </span>
            </div>
          )}
        </div>
        <div className={styles['data-container__border']}></div>
      </div>
      {children}
    </div>
  );
}
