import mainApi from './mainApi';
import { TaskListInterface } from '@/shared/interfaces/task-list.interface';
import { TaskInterface } from '@/shared/interfaces/task.interface';
import { CreateTaskInterface } from '@/shared/interfaces/create-task.interface';
import { MoveTaskInterface } from '@/shared/interfaces/move-task.interface';

const TASKS_PAGE_SIZE = 20;
/* ---------------------------------------------------------------------------------------------- */
/* All tags are invalidated in useBoardSocket hook                                                */
/* ---------------------------------------------------------------------------------------------- */
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
    addTask: builder.mutation<TaskInterface, CreateTaskInterface>({
      query: (data) => ({
        url: 'tasks',
        method: 'POST',
        body: data,
      }),
    }),
    moveTask: builder.mutation<
      TaskInterface,
      {
        id: string;
        data: MoveTaskInterface;
      }
    >({
      query: ({ id, data }) => ({
        url: `tasks/${id}/move`,
        method: 'PATCH',
        body: data,
      }),
    }),
    updateTask: builder.mutation<
      TaskInterface,
      {
        id: string;
        data: CreateTaskInterface;
      }
    >({
      query: ({ id, data }) => ({
        url: `tasks/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteTask: builder.mutation<void, string>({
      query: (id) => ({
        url: `tasks/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetTasksInfiniteQuery,
  useAddTaskMutation,
  useMoveTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = tasksApi;
