import { ReactElement, ReactNode } from 'react';
import styles from './layout.module.scss';
import BoardsHeader from './BoardsHeader/BoardsHeader';

export default function BoardsLayout({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  return (
    <div className={styles['boards-layout']}>
      <BoardsHeader />
      <div>{children}</div>
    </div>
  );
}
