'use client';

import { ReactElement, useState } from 'react';
import { ProjectParticipationInterface } from '@/shared/interfaces/project-participation.interface';
import styles from './UserRequests.module.scss';
import Link from 'next/link';
import Button from '@/shared/components/Button/Button';
import { datePipe } from '@/shared/utils/datePipe';
import RejectRequestPopup from '@/shared/components/RejectRequestPopup/RejectRequestPopup';
import { UserInterface } from '@/shared/interfaces/user.interface';
import { useAcceptRequestMutation } from '@/api/participationsApi';

interface UserRequestsProps {
  requests: ProjectParticipationInterface[];
  user: UserInterface;
}

export default function UserRequests({
  requests,
  user,
}: UserRequestsProps): ReactElement {
  const [isModalOpen, setModalOpen] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [acceptRequest] = useAcceptRequestMutation();

  const openModal = (id: string): void => {
    setModalOpen(true);
    setRequestId(id);
  };

  const closeModal = (): void => {
    setModalOpen(false);
    setRequestId(null);
  };

  const handleAcceptRequest = async (id: string): Promise<void> => {
    await acceptRequest({ id, userId: user.id });
  };

  return (
    <>
      <div className={styles['user-requests']}>
        <div className={styles['user-requests__header']}>
          <p className={styles['user-requests__title']}>Заявки на участь</p>
          <div className={styles['user-requests__border']}></div>
        </div>
        <table className={styles['user-requests__table']}>
          <colgroup>
            <col className={styles['user-requests__col-1']} />
            <col className={styles['user-requests__col-auto']} />
            <col className={styles['user-requests__col-auto']} />
            <col className={styles['user-requests__col-auto']} />
            <col className={styles['user-requests__col-5']} />
          </colgroup>
          <thead>
            <tr>
              <th
                className={`${styles['user-requests__cell']} ${styles['user-requests__cell--header']}`}
                scope="col"
              >
                №
              </th>
              <th
                className={`${styles['user-requests__cell']} ${styles['user-requests__cell--header']}`}
              >
                Назва проєкту
              </th>
              <th
                className={`${styles['user-requests__cell']} ${styles['user-requests__cell--header']}`}
              >
                Роль
              </th>
              <th
                className={`${styles['user-requests__cell']} ${styles['user-requests__cell--header']}`}
              >
                Дата
              </th>
              <th
                className={`${styles['user-requests__cell']} ${styles['user-requests__cell--header']}`}
              >
                Дії
              </th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request, index) => (
              <tr key={request.id} className={styles['user-requests__row']}>
                <td
                  className={`${styles['user-requests__cell']} ${styles['user-requests__cell--body']}`}
                >
                  0{index + 1}
                </td>
                <td
                  className={`${styles['user-requests__cell']} ${styles['user-requests__cell--body']}`}
                >
                  <Link
                    className={styles['user-requests__link']}
                    href={`/projects/${request.projectRole.project.id}`}
                  >
                    {request.projectRole.project.projectName}
                  </Link>
                </td>
                <td
                  className={`${styles['user-requests__cell']} ${styles['user-requests__cell--body']}`}
                >
                  {request.projectRole.roleType.roleName}
                </td>
                <td
                  className={`${styles['user-requests__cell']} ${styles['user-requests__cell--body']}`}
                >
                  {datePipe(request.createdAt.toString(), 'DD.MM.YYYY')}
                </td>
                <td
                  className={`${styles['user-requests__cell']} ${styles['user-requests__cell--body']}`}
                >
                  <div className={styles['user-requests__actions']}>
                    <Button
                      variant="link"
                      size="ssm"
                      color="gray-2"
                      onClick={() => openModal(request.id)}
                    >
                      Відхилити
                    </Button>
                    /{' '}
                    <Button
                      variant="link"
                      size="ssm"
                      color="green"
                      onClick={() => handleAcceptRequest(request.id)}
                    >
                      Прийняти
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && requestId && (
        <RejectRequestPopup
          onClose={closeModal}
          requestId={requestId}
          user={user}
        />
      )}
    </>
  );
}
