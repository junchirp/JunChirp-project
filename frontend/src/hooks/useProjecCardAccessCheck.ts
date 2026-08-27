'use client';

import { useParams } from 'next/navigation';
import { useGetProjectCardByIdQuery } from '@/api/projectsApi';
import { ProjectCardExpandedInterface } from '@/shared/interfaces/project-card-expanded.interface';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';

export const useProjectCardAccessCheck = (): {
  data: ProjectCardExpandedInterface | undefined;
  error: FetchBaseQueryError | SerializedError | undefined;
  isLoading: boolean;
} => {
  const { projectId } = useParams<{ projectId: string }>();
  const { data, error, isLoading } = useGetProjectCardByIdQuery(projectId);
  return { data, error, isLoading };
};
