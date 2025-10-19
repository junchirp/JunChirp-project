'use client';

import { ReactElement, ReactNode, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useAppSelector } from '@/hooks/reduxHooks';
import authSelector from '@/redux/auth/authSelector';
import { SerializedError } from '@reduxjs/toolkit';

interface AccessGuardProps {
  children: ReactNode;
  checkDataAccess?: () =>
    | {
        error?: FetchBaseQueryError | SerializedError | undefined;
        isLoading?: boolean;
      }
    | undefined;
  loadingFallback?: ReactNode;
}

export default function AccessGuard({
  children,
  checkDataAccess,
  loadingFallback = null,
}: AccessGuardProps): ReactElement {
  const user = useAppSelector(authSelector.selectUser);
  const status = useAppSelector(authSelector.selectLoadingStatus);
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const accessCheck = checkDataAccess?.();
  const isDataLoading = accessCheck?.isLoading ?? false;
  const accessError = accessCheck?.error;

  const isLoading = status !== 'loaded' || isDataLoading;

  const shouldRedirect = !user?.isVerified || !user || accessError;

  useEffect(() => {
    if (!isLoading && shouldRedirect) {
      router.push(`/projects/${id}`);
    }
  }, [isLoading, shouldRedirect, router]);

  if (isLoading || shouldRedirect) {
    return <>{loadingFallback}</>;
  }

  return <>{children}</>;
}
