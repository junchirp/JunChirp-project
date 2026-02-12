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
import { useLocale, useTranslations } from 'next-intl';
import { Locale } from '@/i18n/routing';

export default function ConfirmEmailContent(): ReactElement {
  const user = useAppSelector(authSelector.selectUser);
  const searchParams = useSearchParams();
  const authType = searchParams.get('type');
  const { showToast, isActive } = useToast();
  const [sendEmail, { isLoading }] = useSendConfirmationEmailMutation();
  const [isModalOpen, setModalOpen] = useState(false);
  const tConfirmation = useTranslations('emailConfirmation');
  const tButtons = useTranslations('buttons');
  const tInfo: string[] = tConfirmation.raw('information');
  const locale = useLocale();

  const sendConfirmationRequest = async (): Promise<void> => {
    if (isActive('confirm email')) {
      return;
    }

    const result = await sendEmail({
      email: user?.email ?? '',
      locale: locale as Locale,
    });

    if ('data' in result) {
      showToast({
        severity: 'success',
        summary: tConfirmation('success'),
        detail: tConfirmation('successDetails'),
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
          summary: tConfirmation('error429'),
          detail: tConfirmation('error429Details'),
          life: 3000,
          actionKey: 'confirm email',
        });
      } else if (status === 400) {
        showToast({
          severity: 'error',
          summary: tConfirmation('error400'),
          detail: tConfirmation('error400Details'),
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
          {tConfirmation('title')}
        </h2>
        <div className={styles['confirm-email-content__content']}>
          {authType === 'registration' ? (
            <div>
              {tConfirmation.rich('firstRegistrationPart', {
                email: (chunks) => (
                  <span className={styles['confirm-email-content__green-text']}>
                    {chunks}
                  </span>
                ),
                userEmail: user?.email ?? '',
              })}
            </div>
          ) : (
            <div>
              {tConfirmation.rich('firstLoginPart', {
                email: (chunks) => (
                  <span className={styles['confirm-email-content__green-text']}>
                    {chunks}
                  </span>
                ),
                userEmail: user?.email ?? '',
                button: (chunks) => (
                  <Button
                    className={styles['confirm-email-content__inline-button']}
                    variant="link"
                    color="green"
                    onClick={sendConfirmationRequest}
                    loading={isLoading}
                  >
                    {chunks}
                  </Button>
                ),
              })}
            </div>
          )}
          <div>
            {tConfirmation.rich('secondPart', {
              button: (chunks) => (
                <Button
                  variant="link"
                  color="green"
                  onClick={sendConfirmationRequest}
                  loading={isLoading}
                >
                  {chunks}
                </Button>
              ),
            })}
          </div>
        </div>
        <div className={styles['confirm-email-content__content']}>
          <h6 className={styles['confirm-email-content__sub-title']}>
            {tConfirmation('subTitle')}
          </h6>
          {tInfo.map((fragment, index) => (
            <p key={index}>{fragment}</p>
          ))}
        </div>
        <Button color="green" onClick={openModal}>
          {tButtons('enterAnotherEmail')}
        </Button>
      </div>
      {isModalOpen && <ChangeEmailPopup onClose={closeModal} />}
    </>
  );
}
