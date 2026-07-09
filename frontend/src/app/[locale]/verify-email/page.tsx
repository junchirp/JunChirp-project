'use client';

import { ReactElement, useEffect } from 'react';
import Spinner from '@/shared/components/Spinner/Spinner';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { useConfirmEmailMutation } from '@/api/authApi';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import styles from './page.module.scss';

export default function VerifyEmail(): ReactElement {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') ?? '';
  const [verifyEmail] = useConfirmEmailMutation();

  useEffect(() => {
    const verify = async (): Promise<void> => {
      try {
        await verifyEmail({ token }).unwrap();
        router.push('/verify-email/success');
      } catch (err) {
        const error = err as FetchBaseQueryError & {
          data?: {
            error?: string;
          };
        };

        if (error.status === 400 && error.data?.error !== 'Validation Error') {
          router.push(
            `/verify-email/invalid?token=${encodeURIComponent(token)}`,
          );
        } else {
          router.push('/verify-email/deleted');
        }
      }
    };

    void verify();
  }, [token, verifyEmail, router]);

  return (
    <div className={styles['verify-email']}>
      <Spinner size={100} />
    </div>
  );
}
