'use client';

import { useParams } from 'next/navigation';
import { useGetProjectByIdQuery } from '../api/projectsApi';
import { ProjectInterface } from '../shared/interfaces/project.interface';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';

export function useProjectAccessCheck(): {
  data: ProjectInterface | undefined;
  error: FetchBaseQueryError | SerializedError | undefined;
  isLoading: boolean;
} {
  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading } = useGetProjectByIdQuery(id);
  return { data, error, isLoading };
}
