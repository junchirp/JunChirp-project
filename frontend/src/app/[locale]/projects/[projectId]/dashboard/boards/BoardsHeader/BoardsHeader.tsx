'use client';

import { ReactElement, useEffect, useState } from 'react';
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
import { BoardInterface } from '@/shared/interfaces/board.interface';

export default function BoardsHeader(): ReactElement | null {
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
  const isInitialLoading = projectLoading || boardsLoading;
  const t = useTranslations('boards');
  const [selectedBoard, setSelectedBoard] = useState<
    BoardInterface | undefined
  >();
  const boardForRender = currentBoard ?? selectedBoard;

  useEffect(() => {
    if (currentBoard) {
      setSelectedBoard(currentBoard);
    }
  }, [currentBoard]);

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
    if (
      isActive(ToastKeysEnum.BOARD) ||
      duplicateBoardLoading ||
      !boardForRender
    ) {
      return;
    }

    try {
      const board = await duplicateBoard({
        id: boardForRender.id,
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
    if (isActive(ToastKeysEnum.BOARD) || deleteBoardLoading) {
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
    if (!boardForRender) {
      return;
    }

    const hasTasks = boardForRender.columns.some(
      (column) => column.tasksCount > 0,
    );

    if (hasTasks) {
      setIsOpenPopup(true);
      return;
    }

    await handleDeleteBoard(boardForRender.id);
  };

  if (isInitialLoading || !boardForRender) {
    return <ListSkeleton itemHeight={207} noPadding columns={1} />;
  }

  return (
    <>
      <DataContainer
        title={t('title')}
        counterMaxSize={5}
        counterSize={boards.length}
      >
        {isEditMode && boardForRender ? (
          <div className={styles['boards-header__dropdown-header']}>
            <BoardForm
              currentBoard={boardForRender}
              boards={boards}
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
                value={boardForRender.id}
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
                  currentBoard={boardForRender}
                  onDuplicate={handleCopyBoard}
                  onDelete={handleDeleteBoardRequest}
                  onRename={() => setEditMode(true)}
                />
                <Button
                  color="green"
                  icon={<Plus />}
                  disabled={boards.length >= 5}
                  onClick={handleAddBoard}
                  loading={createBoardLoading}
                />
              </>
            )}
          </div>
        )}
      </DataContainer>
      <DeleteBoardPopup
        isOpen={isOpenPopup}
        board={boardForRender}
        onClose={() => setIsOpenPopup(false)}
        onConfirm={() => handleDeleteBoard(boardForRender.id)}
        loading={deleteBoardLoading}
      />
    </>
  );
}
