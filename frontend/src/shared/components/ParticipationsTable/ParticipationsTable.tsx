import { ReactElement } from 'react';
import styles from './ParticipationsTable.module.scss';
import Link from 'next/link';
import { datePipe } from '../../utils/datePipe';
import Button from '../Button/Button';
import { ProjectParticipationInterface } from '../../interfaces/project-participation.interface';

interface ParticipationsTableProps {
  items: ProjectParticipationInterface[];
  openModal: (request: ProjectParticipationInterface) => void;
  accept?: (id: string) => void;
  isLoading: boolean;
  actionColumnWidth: number;
}

export default function ParticipationsTable(
  props: ParticipationsTableProps,
): ReactElement {
  const { items, openModal, accept, isLoading, actionColumnWidth } = props;

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
            №
          </th>
          <th
            className={`${styles['participations-table__cell']} ${styles['participations-table__cell--header']}`}
          >
            Назва проєкту
          </th>
          <th
            className={`${styles['participations-table__cell']} ${styles['participations-table__cell--header']}`}
          >
            Роль
          </th>
          <th
            className={`${styles['participations-table__cell']} ${styles['participations-table__cell--header']}`}
          >
            Дата
          </th>
          <th
            className={`${styles['participations-table__cell']} ${styles['participations-table__cell--header']}`}
          >
            Дії
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
                      onClick={() => openModal(item)}
                    >
                      Відхилити
                    </Button>{' '}
                    /{' '}
                    <Button
                      variant="link"
                      size="ssm"
                      color="green"
                      loading={isLoading}
                      onClick={() => accept(item.id)}
                    >
                      Прийняти
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="link"
                    size="ssm"
                    color="gray-2"
                    onClick={() => openModal(item)}
                  >
                    Скасувати
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
