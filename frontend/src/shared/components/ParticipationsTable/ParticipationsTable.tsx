'use client';

import { ReactElement } from 'react';
import styles from './ParticipationsTable.module.scss';
import { Link } from '@/i18n/routing';
import Button from '@/shared/components/Button/Button';
import { ProjectParticipationInterface } from '@/shared/interfaces/project-participation.interface';
import { useTranslations } from 'next-intl';
import ParticipationTooltip from './ParticipationTooltip/ParticipationTooltip';

interface ParticipationsTableProps {
  items: ProjectParticipationInterface[];
  page: number;
  limit: number;
  openModal?: (item: ProjectParticipationInterface) => void;
  accept?: (item: ProjectParticipationInterface) => void;
  cancel?: (item: ProjectParticipationInterface) => void;
  isLoading: boolean;
  actionColumnWidth: number;
}

export default function ParticipationsTable(
  props: ParticipationsTableProps,
): ReactElement {
  const {
    items,
    page,
    limit,
    openModal,
    accept,
    isLoading,
    actionColumnWidth,
    cancel,
  } = props;
  const tTable = useTranslations('participationsTable');
  const tButtons = useTranslations('buttons');
  const cancelEvent = openModal ?? cancel;

  return (
    <table className={styles['participations-table']}>
      <colgroup>
        <col className={styles['participations-table__col-first']} />
        <col className={styles['participations-table__col-auto']} />
        <col className={styles['participations-table__col-auto']} />
        <col className={styles['participations-table__col-auto']} />
        <col style={{ width: `${actionColumnWidth}px` }} />
      </colgroup>
      <thead>
        <tr>
          <th
            className={`${styles['participations-table__cell']} ${styles['participations-table__cell--header']}`}
            scope="col"
          >
            {tTable('colFirst')}
          </th>
          <th
            className={`${styles['participations-table__cell']} ${styles['participations-table__cell--header']}`}
          >
            {tTable('colProject')}
          </th>
          <th
            className={`${styles['participations-table__cell']} ${styles['participations-table__cell--header']}`}
          >
            {tTable('colRole')}
          </th>
          <th
            className={`${styles['participations-table__cell']} ${styles['participations-table__cell--header']}`}
          >
            {tTable('colStatus')}
          </th>
          <th
            className={`${styles['participations-table__cell']} ${styles['participations-table__cell--header']}`}
          >
            {tTable('colActions')}
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => {
          const totalIndex = (page - 1) * limit + index + 1;

          return (
            <tr key={item.id} className={styles['participations-table__row']}>
              <td
                className={`${styles['participations-table__cell']} ${styles['participations-table__cell--body']}`}
              >
                {totalIndex < 10 ? `0${totalIndex}` : `${totalIndex}`}
              </td>
              <td
                className={`${styles['participations-table__cell']} ${styles['participations-table__cell--body']}`}
              >
                <Link
                  className={styles['participations-table__link']}
                  href={`/projects/${item.projectRole.project.id}`}
                  target="_blank"
                >
                  {item.projectRole.project.projectName}
                </Link>
              </td>
              <td
                className={`${styles['participations-table__cell']} ${styles['participations-table__cell--body']}`}
              >
                {item.projectRole.roleType.roleName}
              </td>
              <td
                className={`
                  ${styles['participations-table__cell']}
                  ${styles['participations-table__cell--body']}
                  ${styles['participations-table__cell--status']}
                `}
              >
                <div className={styles['participations-table__tooltip']}>
                  <ParticipationTooltip
                    createdAt={item.createdAt}
                    acceptedAt={item.acceptedAt}
                    canceledAt={item.canceledAt}
                    rejectedAt={item.rejectedAt}
                    reservedAt={item.reservedAt}
                  />
                </div>
                <span>{tTable(item.status)}</span>
              </td>
              <td
                className={`${styles['participations-table__cell']} ${styles['participations-table__cell--body']}`}
              >
                {(item.status === 'pending' || item.status === 'reserved') && (
                  <div className={styles['participations-table__actions']}>
                    {accept ? (
                      <>
                        <Button
                          variant="link"
                          size="ssm"
                          color="gray-2"
                          onClick={() => cancelEvent?.(item)}
                        >
                          {tButtons('decline')}
                        </Button>{' '}
                        /{' '}
                        <Button
                          variant="link"
                          size="ssm"
                          color="green"
                          loading={isLoading}
                          onClick={() => accept(item)}
                        >
                          {tButtons('accept')}
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="link"
                        size="ssm"
                        color="gray-2"
                        onClick={() => cancelEvent?.(item)}
                      >
                        {tButtons('cancel')}
                      </Button>
                    )}
                  </div>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
