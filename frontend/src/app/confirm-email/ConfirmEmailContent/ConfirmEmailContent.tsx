'use client';

import { ReactElement, useState } from 'react';
import Button from '@/shared/components/Button/Button';
import styles from './ConfirmEmailContent.module.scss';
import { useAppSelector } from '@/hooks/reduxHooks';
import authSelector from '@/redux/auth/authSelector';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/useToast';
import { useSendConfirmationEmailMutation } from '@/api/authApi';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import ChangeEmailPopup from './ChangeEmailPopup/ChangeEmailPopup';

export default function ConfirmEmailContent(): ReactElement {
  const user = useAppSelector(authSelector.selectUser);
  const searchParams = useSearchParams();
  const authType = searchParams.get('type');
  const { showToast, isActive } = useToast();
  const [sendEmail, { isLoading }] = useSendConfirmationEmailMutation();
  const [isModalOpen, setModalOpen] = useState(false);

  const sendConfirmationRequest = async (): Promise<void> => {
    if (isActive('confirm email')) {
      return;
    }

    const result = await sendEmail({ email: user?.email ?? '' });

    if ('data' in result) {
      showToast({
        severity: 'success',
        summary: 'Запит успішно оброблено.',
        detail: 'Перевір пошту для підтвердження.',
        life: 3000,
        actionKey: 'confirm email',
      });
    } else if ('error' in result) {
      const errorData = result.error as
        | ((FetchBaseQueryError | SerializedError) & { status: number })
        | undefined;
      const status = errorData?.status;
      if (status === 429) {
        showToast({
          severity: 'error',
          summary:
            'Перевищено ліміт запитів на підтвердження електронної пошти.',
          detail: 'Будь ласка, спробуй надіслати новий запит через 1 годину.',
          life: 3000,
          actionKey: 'confirm email',
        });
      } else if (status === 404) {
        showToast({
          severity: 'error',
          summary: 'Виникла помилка при обробці запиту.',
          detail: 'Email вже підтверджений.',
          life: 3000,
          actionKey: 'confirm email',
        });
      }
    }
  };

  const closeModal = (): void => setModalOpen(false);
  const openModal = (): void => setModalOpen(true);

  return (
    <>
      <div className={styles['confirm-email-content']}>
        <h2 className={styles['confirm-email-content__title']}>
          Підтвердження електронної пошти
        </h2>
        <div className={styles['confirm-email-content__content']}>
          {authType === 'registration' ? (
            <div>
              Ми надіслали лист із посиланням для підтвердження на{' '}
              <span className={styles['confirm-email-content__green-text']}>
                [{user?.email ?? ''}]
              </span>
              . Перевір свою поштову скриньку та натисни на посилання для
              підтвердження реєстрації.
            </div>
          ) : (
            <div>
              Ти ще не підтвердив свою електронну пошту. Щоб завершити
              реєстрацію,{' '}
              <div className={styles['confirm-email-content__button-wrapper']}>
                <span
                  className={styles['confirm-email-content__dark-green-text']}
                >
                  {'{ '}
                </span>
                <Button
                  className={styles['confirm-email-content__inline-button']}
                  variant="link"
                  color="green"
                  onClick={sendConfirmationRequest}
                  loading={isLoading}
                >
                  Натисни тут
                </Button>
                <span
                  className={styles['confirm-email-content__dark-green-text']}
                >
                  {' }'}
                </span>
              </div>{' '}
              - ми надішлемо лист із посиланням для підтвердження.
            </div>
          )}
          <div>
            Якщо лист не надійшов, будь ласка, перевір папку "Спам" або{' '}
            <div className={styles['confirm-email-content__button-wrapper']}>
              <span
                className={styles['confirm-email-content__dark-green-text']}
              >
                {'{ '}
              </span>
              <Button
                className={styles['confirm-email-content__inline-button']}
                variant="link"
                color="green"
                onClick={sendConfirmationRequest}
                loading={isLoading}
              >
                Надішли запит
              </Button>
              <span
                className={styles['confirm-email-content__dark-green-text']}
              >
                {' }'}
              </span>
            </div>{' '}
            ще раз.
          </div>
        </div>
        <div className={styles['confirm-email-content__content']}>
          <h6 className={styles['confirm-email-content__sub-title']}>
            Важлива інформація:
          </h6>
          <p>
            Термін дії посилання: Посилання на підтвердження електронної пошти
            дійсне протягом 24 годин.
          </p>
          <p>
            Нове посилання анулює старе: Кожного разу, коли ти запитуєш нове
            посилання, попереднє стає недійсним. Це означає, що старе посилання
            більше не буде працювати, і тобі потрібно буде використати нове.
          </p>
          <p>
            По закінченні 24 годин: Якщо ти не підтвердиш свою електронну пошту
            протягом 24 годин, твої дані будуть видалені з нашої бази даних, і
            тобі потрібно буде почати процес реєстрації знову.
          </p>
        </div>
        <Button color="green" onClick={openModal}>
          Ввести інший e-mail
        </Button>
      </div>
      {isModalOpen && <ChangeEmailPopup onClose={closeModal} />}
    </>
  );
}
