'use client';

import { useParams } from 'next/navigation';
import { useGetProjectCardByIdQuery } from '@/api/projectsApi';
import { ProjectInterface } from '@/shared/interfaces/project.interface';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';

export const useProjectCardAccessCheck = (): {
  data: ProjectInterface | undefined;
  error: FetchBaseQueryError | SerializedError | undefined;
  isLoading: boolean;
} => {
  const { projectId } = useParams<{ projectId: string }>();
  const { data, error, isLoading } = useGetProjectCardByIdQuery(projectId);
  return { data, error, isLoading };
};
