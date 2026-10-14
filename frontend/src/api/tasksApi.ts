import mainApi from './mainApi';
import { TaskListInterface } from '@/shared/interfaces/task-list.interface';
import { TaskInterface } from '@/shared/interfaces/task.interface';
import { CreateTaskInterface } from '@/shared/interfaces/create-task.interface';
import { MoveTaskInterface } from '@/shared/interfaces/move-task.interface';

const TASKS_PAGE_SIZE = 20;

export const tasksApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.infiniteQuery<
      TaskListInterface,
      string,
      string | undefined
    >({
      infiniteQueryOptions: {
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => lastPage.cursor ?? undefined,
      },

      query: ({ queryArg: id, pageParam }) => ({
        url: `/tasks/${id}?limit=${TASKS_PAGE_SIZE}${pageParam !== undefined ? `&cursor=${pageParam}` : ''}`,
      }),

      providesTags: (_result, _error, id) => [{ type: 'tasks', id }],
    }),
    addTask: builder.mutation<
      TaskInterface,
      { data: CreateTaskInterface; boardId: string }
    >({
      query: ({ data }) => ({
        url: 'tasks',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, { boardId, data }) => [
        { type: 'tasks', id: data.taskStatusId },
        { type: 'board', id: boardId },
      ],
    }),
    moveTask: builder.mutation<
      TaskInterface,
      {
        id: string;
        boardId: string;
        data: MoveTaskInterface;
      }
    >({
      query: ({ id, data }) => ({
        url: `tasks/${id}/move`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { data, boardId }) => [
        { type: 'board', id: boardId },
        { type: 'tasks', id: data.newColumnId },
        { type: 'tasks', id: data.oldColumnId },
      ],
    }),
  }),
});

export const {
  useGetTasksInfiniteQuery,
  useAddTaskMutation,
  useMoveTaskMutation,
} = tasksApi;
