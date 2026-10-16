import mainApi from './mainApi';
import { BoardInterface } from '@/shared/interfaces/board.interface';
import { CreateBoardInterface } from '@/shared/interfaces/create-board.interface';
import { ColumnOrderInterface } from '@/shared/interfaces/column-order.interface';
import { TaskStatusWithCountInterface } from '@/shared/interfaces/task-status-with-count.interface';
import { CreateTaskStatusInterface } from '@/shared/interfaces/create-task-status.interface';
import { ShortLocaleType } from '@/shared/types/short-locale.type';
/* ---------------------------------------------------------------------------------------------- */
/* All tags are invalidated in useBoardSocket hook                                                */
/* ---------------------------------------------------------------------------------------------- */
export const boardsApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getBoards: builder.query<BoardInterface[], string>({
      query: (id) => ({
        url: `projects/${id}/boards`,
      }),
      providesTags: (_result, _error, id) => [{ type: 'boards', id }],
    }),
    getBoard: builder.query<BoardInterface, string>({
      query: (id) => ({
        url: `boards/${id}`,
      }),
      providesTags: (_result, _error, id) => [{ type: 'board', id }],
    }),
    createBoard: builder.mutation<BoardInterface, CreateBoardInterface>({
      query: (data) => ({
        url: 'boards',
        method: 'POST',
        body: data,
      }),
    }),
    updateBoard: builder.mutation<
      BoardInterface,
      { id: string; boardName: string }
    >({
      query: ({ id, boardName }) => ({
        url: `boards/${id}`,
        method: 'PUT',
        body: { boardName },
      }),
    }),
    deleteBoard: builder.mutation<void, string>({
      query: (id) => ({
        url: `boards/${id}`,
        method: 'DELETE',
      }),
    }),
    duplicateBoard: builder.mutation<
      BoardInterface,
      { id: string; locale: ShortLocaleType }
    >({
      query: ({ id, locale }) => ({
        url: `boards/${id}/copy`,
        method: 'POST',
        body: { locale },
      }),
    }),
    updateColumnsOrder: builder.mutation<
      BoardInterface,
      {
        id: string;
        columns: ColumnOrderInterface[];
      }
    >({
      query: ({ id, columns }) => ({
        url: `boards/${id}/reorder-columns`,
        method: 'PATCH',
        body: { columns },
      }),
    }),
    updateColumn: builder.mutation<
      TaskStatusWithCountInterface,
      {
        id: string;
        statusName: string;
      }
    >({
      query: ({ id, statusName }) => ({
        url: `boards/columns/${id}`,
        method: 'PATCH',
        body: { statusName },
      }),
    }),
    createColumn: builder.mutation<
      TaskStatusWithCountInterface,
      CreateTaskStatusInterface
    >({
      query: (data) => ({
        url: 'boards/columns',
        method: 'POST',
        body: data,
      }),
    }),
    deleteColumn: builder.mutation<void, string>({
      query: (id) => ({
        url: `boards/columns/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetBoardsQuery,
  useUpdateBoardMutation,
  useGetBoardQuery,
  useCreateBoardMutation,
  useDeleteBoardMutation,
  useDuplicateBoardMutation,
  useUpdateColumnsOrderMutation,
  useUpdateColumnMutation,
  useCreateColumnMutation,
  useDeleteColumnMutation,
} = boardsApi;
