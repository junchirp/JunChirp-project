'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useRouter } from '@/i18n/routing';
import { useGetBoardsQuery } from '@/api/boardsApi';

export default function Boards(): null {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: boards } = useGetBoardsQuery(projectId);
  const router = useRouter();

  useEffect(() => {
    if (!boards) {
      return;
    }

    router.replace(`/projects/${projectId}/dashboard/boards/${boards[0].id}`);
  }, [boards, projectId, router]);

  return null;
}
