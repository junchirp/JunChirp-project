import mainApi from './mainApi';
import { BoardInterface } from '@/shared/interfaces/board.interface';
import { CreateBoardInterface } from '@/shared/interfaces/create-board.interface';
import { UpdateBoardInterface } from '@/shared/interfaces/update-board.interface';
import { ColumnOrderInterface } from '@/shared/interfaces/column-order.interface';

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
      invalidatesTags: (_result, _error, data) => [
        { type: 'boards', id: data.projectId },
      ],
    }),
    updateBoard: builder.mutation<
      BoardInterface,
      { id: string; data: UpdateBoardInterface }
    >({
      query: ({ id, data }) => ({
        url: `boards/${id}`,
        method: 'PUT',
        body: { boardName: data.boardName },
      }),
      invalidatesTags: (_result, _error, { id, data }) => [
        { type: 'boards', id: data.projectId },
        { type: 'board', id },
      ],
    }),
    deleteBoard: builder.mutation<void, { id: string; projectId: string }>({
      query: ({ id }) => ({
        url: `boards/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { projectId }) => [
        { type: 'boards', id: projectId },
      ],
    }),
    duplicateBoard: builder.mutation<
      BoardInterface,
      { id: string; data: CreateBoardInterface }
    >({
      query: ({ id, data }) => ({
        url: `boards/${id}/copy`,
        method: 'POST',
        body: { locale: data.locale },
      }),
      invalidatesTags: (_result, _error, { data }) => [
        { type: 'boards', id: data.projectId },
      ],
    }),
    updateColumnsOrder: builder.mutation<
      BoardInterface,
      {
        id: string;
        data: { columns: ColumnOrderInterface[]; projectId: string };
      }
    >({
      query: ({ id, data }) => ({
        url: `boards/${id}/reorder-columns`,
        method: 'PATCH',
        body: { columns: data.columns },
      }),
      invalidatesTags: (_result, _error, { id, data }) => [
        { type: 'boards', id: data.projectId },
        { type: 'board', id },
      ],
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
} = boardsApi;
