'use client';

import React, { ReactElement, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { useValidateTokenQuery } from '@/api/authApi';
import NewPassword from './NewPassword/NewPassword';
import { RecoveryPasswordInterface } from '@/shared/interfaces/recovery-password.interface';

export default function ResetPassword(): ReactElement | null {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const { data, isLoading, isError } = useValidateTokenQuery(token, {
    skip: !token,
  });

  useEffect(() => {
    if (!token) {
      router.replace('/reset-password/error');
    }
  }, [token, router]);

  useEffect(() => {
    if (!isLoading && (isError || data?.isValid === false)) {
      router.replace('/reset-password/error');
    }
  }, [isLoading, isError, data, router]);

  if (isLoading || !data?.isValid) {
    return null;
  }

  const recoveryData: RecoveryPasswordInterface = {
    firstName: data.firstName,
    lastName: data.lastName,
    token: token,
  };

  return <NewPassword recoveryData={recoveryData} />;
}
