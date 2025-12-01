import { ReactElement } from 'react';
import styles from './ParticipationsTable.module.scss';
import { Link } from '@/i18n/routing';
import { datePipe } from '../../utils/datePipe';
import Button from '../Button/Button';
import { ProjectParticipationInterface } from '../../interfaces/project-participation.interface';
import { useTranslations } from 'next-intl';

interface ParticipationsTableProps {
  items: ProjectParticipationInterface[];
  openModal?: (item: ProjectParticipationInterface) => void;
  accept?: (id: string) => void;
  cancel?: (item: ProjectParticipationInterface) => void;
  isLoading: boolean;
  actionColumnWidth: number;
}

export default function ParticipationsTable(
  props: ParticipationsTableProps,
): ReactElement {
  const { items, openModal, accept, isLoading, actionColumnWidth, cancel } =
    props;
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
            {tTable('colDate')}
          </th>
          <th
            className={`${styles['participations-table__cell']} ${styles['participations-table__cell--header']}`}
          >
            {tTable('colActions')}
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => (
          <tr key={item.id} className={styles['participations-table__row']}>
            <td
              className={`${styles['participations-table__cell']} ${styles['participations-table__cell--body']}`}
            >
              {index < 9 ? `0${index + 1}` : `${index + 1}`}
            </td>
            <td
              className={`${styles['participations-table__cell']} ${styles['participations-table__cell--body']}`}
            >
              <Link
                className={styles['participations-table__link']}
                href={`/projects/${item.projectRole.project.id}`}
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
              className={`${styles['participations-table__cell']} ${styles['participations-table__cell--body']}`}
            >
              {datePipe(item.createdAt.toString(), 'DD.MM.YYYY')}
            </td>
            <td
              className={`${styles['participations-table__cell']} ${styles['participations-table__cell--body']}`}
            >
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
                      onClick={() => accept(item.id)}
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
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
