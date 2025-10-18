'use client';

import { useParams } from 'next/navigation';
import { useGetProjectByIdQuery } from '../api/projectsApi';
import { ProjectInterface } from '../shared/interfaces/project.interface';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { useAppSelector } from './reduxHooks';
import authSelector from '../redux/auth/authSelector';

export function useProjectAccessCheck(): {
  data: ProjectInterface | undefined;
  error: FetchBaseQueryError | SerializedError | undefined;
  isFetching: boolean;
} {
  const { id } = useParams<{ id: string }>();
  const user = useAppSelector(authSelector.selectUser);
  const { data, error, isFetching } = useGetProjectByIdQuery({
    id,
    userId: user?.id ?? '',
  });
  return { data, error, isFetching };
}
