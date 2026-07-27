'use client';

import { ReactElement, useState } from 'react';
import styles from './BoardsHeader.module.scss';
import { useParams } from 'next/navigation';
import {
  useCreateBoardMutation,
  useDeleteBoardMutation,
  useDuplicateBoardMutation,
  useGetBoardsQuery,
} from '@/api/boardsApi';
import ListSkeleton from '@/shared/components/ListSkeleton/ListSkeleton';
import DataContainer from '@/shared/components/DataContainer/DataContainer';
import Dropdown from '@/shared/components/Dropdown/Dropdown';
import { useRouter } from '@/i18n/routing';
import BoardForm from './BoardForm/BoardForm';
import Button from '@/shared/components/Button/Button';
import Plus from '@/assets/icons/plus.svg';
import BoardMenu from './BoardMenu/BoardMenu';
import { useGetProjectByIdQuery } from '@/api/projectsApi';
import { useAppSelector } from '@/hooks/reduxHooks';
import authSelector from '@/redux/auth/authSelector';
import { useToast } from '@/hooks/useToast';
import { ToastKeysEnum } from '@/shared/enums/toast-keys.enum';
import { useShortLocale } from '@/hooks/useShortLocale';
import { useTranslations } from 'next-intl';
import DeleteBoardPopup from './DeleteBoardPopup/DeleteBoardPopup';

export default function BoardsHeader(): ReactElement {
  const { projectId, boardId } = useParams<{
    projectId: string;
    boardId: string;
  }>();
  const { data: boards = [], isLoading: boardsLoading } =
    useGetBoardsQuery(projectId);
  const currentBoard = !boardId
    ? undefined
    : boards.find((board) => board.id === boardId);
  const router = useRouter();
  const [isEditMode, setEditMode] = useState(false);
  const { data: project, isLoading: projectLoading } =
    useGetProjectByIdQuery(projectId);
  const user = useAppSelector(authSelector.selectRequiredUser);
  const isOwner = project?.ownerId === user.id;
  const [createBoard, { isLoading: createBoardLoading }] =
    useCreateBoardMutation();
  const [deleteBoard, { isLoading: deleteBoardLoading }] =
    useDeleteBoardMutation();
  const [duplicateBoard, { isLoading: duplicateBoardLoading }] =
    useDuplicateBoardMutation();
  const { showToast, isActive } = useToast();
  const locale = useShortLocale();
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const isLoading =
    projectLoading ||
    boardsLoading ||
    createBoardLoading ||
    deleteBoardLoading ||
    duplicateBoardLoading;
  const t = useTranslations('boards');

  const handleAddBoard = async (): Promise<void> => {
    if (isActive(ToastKeysEnum.BOARD)) {
      return;
    }

    try {
      const board = await createBoard({ locale, projectId }).unwrap();
      router.push(`/projects/${projectId}/dashboard/boards/${board.id}`);
    } catch {
      showToast({
        severity: 'error',
        summary: t('createBoard.error'),
        detail: t('createBoard.errorDetails'),
        life: 3000,
        actionKey: ToastKeysEnum.BOARD,
      });
    }
  };

  const handleCopyBoard = async (): Promise<void> => {
    if (isActive(ToastKeysEnum.BOARD) || !currentBoard) {
      return;
    }

    try {
      const board = await duplicateBoard({
        id: currentBoard.id,
        data: { locale, projectId },
      }).unwrap();
      router.push(`/projects/${projectId}/dashboard/boards/${board.id}`);
    } catch {
      showToast({
        severity: 'error',
        summary: t('duplicateBoard.error'),
        detail: t('duplicateBoard.errorDetails'),
        life: 3000,
        actionKey: ToastKeysEnum.BOARD,
      });
    }
  };

  const handleDeleteBoard = async (id: string): Promise<void> => {
    if (isActive(ToastKeysEnum.BOARD)) {
      return;
    }

    try {
      setIsOpenPopup(false);
      await deleteBoard({ id, projectId }).unwrap();

      showToast({
        severity: 'success',
        summary: t('deleteBoard.success'),
        life: 3000,
        actionKey: ToastKeysEnum.BOARD,
      });

      router.push(`/projects/${projectId}/dashboard/boards`);
    } catch {
      showToast({
        severity: 'error',
        summary: t('deleteBoard.error'),
        detail: t('deleteBoard.errorDetails'),
        life: 3000,
        actionKey: ToastKeysEnum.BOARD,
      });
    }
  };

  const handleDeleteBoardRequest = async (): Promise<void> => {
    if (!currentBoard) {
      return;
    }

    const hasTasks = currentBoard.columns.some(
      (column) => column.tasksCount > 0,
    );

    if (hasTasks) {
      setIsOpenPopup(true);
      return;
    }

    await handleDeleteBoard(currentBoard.id);
  };

  return isLoading || !currentBoard ? (
    <ListSkeleton itemHeight={160} noPadding columns={1} />
  ) : (
    <>
      <DataContainer
        title={t('title')}
        counterMaxSize={5}
        counterSize={boards.length}
      >
        {isEditMode && currentBoard ? (
          <div className={styles['boards-header__dropdown-header']}>
            <BoardForm
              board={currentBoard}
              onClose={() => setEditMode(false)}
            />
          </div>
        ) : (
          <div className={styles['boards-header']}>
            <div className={styles['boards-header__dropdown']}>
              <Dropdown
                options={boards}
                getOptionLabel={(o) => o.boardName}
                getOptionValue={(o) => o.id}
                value={currentBoard.id}
                onChange={(v) => {
                  if (typeof v !== 'string' || v === boardId) {
                    return;
                  }
                  router.push(`/projects/${projectId}/dashboard/boards/${v}`);
                }}
              />
            </div>
            {isOwner && (
              <>
                <BoardMenu
                  boardsCount={boards.length}
                  currentBoard={currentBoard}
                  onDuplicate={handleCopyBoard}
                  onDelete={handleDeleteBoardRequest}
                  onRename={() => setEditMode(true)}
                />
                <Button
                  color="green"
                  icon={<Plus />}
                  disabled={boards.length >= 5}
                  onClick={handleAddBoard}
                  loading={isLoading}
                />
              </>
            )}
          </div>
        )}
      </DataContainer>
      <DeleteBoardPopup
        isOpen={isOpenPopup}
        board={currentBoard}
        onClose={() => setIsOpenPopup(false)}
        onConfirm={() => handleDeleteBoard(currentBoard.id)}
        loading={isLoading}
      />
    </>
  );
}
