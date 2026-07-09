'use client';

import { useGetMeQuery } from '@/api/authApi';
import { useAppSelector } from '@/hooks/reduxHooks';
import authSelector from '@/redux/auth/authSelector';

export default function UserLoader(): null {
  const loadingStatus = useAppSelector(authSelector.selectLoadingStatus);
  const skip = loadingStatus !== 'idle';
  useGetMeQuery(undefined, { skip });

  return null;
}
