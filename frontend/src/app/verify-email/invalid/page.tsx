'use client';

import { ReactElement } from 'react';
import VerificationResultContent from '@/shared/components/VerificationResultContent/VerificationResultContent';
import Button from '@/shared/components/Button/Button';
import { useSearchParams } from 'next/navigation';
import { useSendConfirmationEmailMutation } from '@/api/authApi';
import { useToast } from '@/hooks/useToast';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';

export default function Invalid(): ReactElement {
  const { showToast, isActive } = useToast();
  const searchParams = useSearchParams();
  const [sendEmail] = useSendConfirmationEmailMutation();
  const email = searchParams.get('email') ?? '';

  const onSubmit = async (): Promise<void> => {
    if (isActive('confirm email')) {
      return;
    }

    const result = await sendEmail({ email });

    if ('data' in result) {
      showToast({
        severity: 'success',
        summary: 'Запит успішно оброблено.',
        detail: 'Перевір пошту для підтвердження.',
        life: 3000,
        actionKey: 'confirm email',
      });
    } else if ('error' in result) {
      const errorData = result.error as (
        | FetchBaseQueryError
        | SerializedError
      ) & {
        status?: number;
      };
      const resStatus = errorData.status;
      if (resStatus === 429) {
        showToast({
          severity: 'error',
          summary:
            'Перевищено ліміт запитів на підтвердження електронної пошти.',
          detail: 'Будь ласка, спробуй надіслати новий запит через 1 годину.',
          life: 3000,
          actionKey: 'confirm email',
        });
      } else if (resStatus === 400) {
        showToast({
          severity: 'error',
          summary: 'Виникла помилка при обробці запиту.',
          detail: 'Email вже підтверджений.',
          life: 3000,
          actionKey: 'confirm email',
        });
      } else {
        showToast({
          severity: 'error',
          summary: 'Винкла помилка при обробці запиту.',
          detail:
            'Можливо посилання було скопійовано і змінено. Email не знайдено.',
          life: 3000,
          actionKey: 'confirm email',
        });
      }
    }
  };

  return (
    <VerificationResultContent
      title="Термін дії посилання завершився"
      titleType="error"
      content={
        <div>
          <p>
            Це посилання більше не дійсне. Будь ласка,{' '}
            <Button variant="link" color="green" onClick={onSubmit}>
              Надішли запит ще раз
            </Button>{' '}
            на нове посилання для підтвердження електронної пошти.
          </p>
        </div>
      }
    />
  );
}
