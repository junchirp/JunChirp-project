'use client';

import { ReactElement, ReactNode, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { usePathname, useRouter } from '@/i18n/routing';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useAppSelector } from '@/hooks/reduxHooks';
import authSelector from '@/redux/auth/authSelector';
import { SerializedError } from '@reduxjs/toolkit';
import { ModeType } from '@/shared/access/access-control.type';
import { ACCESS_RESOLVERS } from '@/shared/access/access-control.config';

type AccessGuardProps =
  | {
      children: ReactNode;
      mode: Exclude<ModeType, 'member'>;
      checkDataAccess?: never;
      loadingFallback?: ReactNode;
    }
  | {
      children: ReactNode;
      mode: 'member';
      checkDataAccess: () =>
        | {
            data?: unknown;
            error?: FetchBaseQueryError | SerializedError;
            isLoading?: boolean;
          }
        | undefined;
      loadingFallback?: ReactNode;
    };

export default function AccessGuard({
  children,
  checkDataAccess,
  loadingFallback = null,
  mode,
}: AccessGuardProps): ReactElement {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const pathname = usePathname();
  const user = useAppSelector(authSelector.selectUser);
  const status = useAppSelector(authSelector.selectLoadingStatus);
  const access = checkDataAccess?.();

  const isLoading =
    status !== 'loaded' || (mode === 'member' && access?.isLoading);

  const resolver = ACCESS_RESOLVERS[mode];

  const redirectTo = !isLoading
    ? resolver({
        user,
        url: pathname,
        projectId: params?.id,
        error: access?.error,
      })
    : null;

  useEffect(() => {
    if (!isLoading && redirectTo) {
      router.replace(redirectTo);
    }
  }, [isLoading, redirectTo, router]);

  if (isLoading || redirectTo) {
    return <>{loadingFallback}</>;
  }

  return <>{children}</>;
}
