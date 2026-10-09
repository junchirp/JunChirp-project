import mainApi from './mainApi';
import { TaskListInterface } from '@/shared/interfaces/task-list.interface';
import { TaskInterface } from '@/shared/interfaces/task.interface';
import { CreateTaskInterface } from '@/shared/interfaces/create-task.interface';

const TASKS_PAGE_SIZE = 20;

export const tasksApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.infiniteQuery<
      TaskListInterface,
      string,
      number | undefined
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
    // deleteHardSkill: builder.mutation<string, string>({
    //   query: (id) => ({
    //     url: `hard-skills/${id}`,
    //     method: 'DELETE',
    //     responseHandler: (response): Promise<string> => response.text(),
    //   }),
    //   invalidatesTags: [{ type: 'hard-skills', id: 'LIST' }],
    // }),
    // getHardSkillsList: builder.query<string[], string>({
    //   query: (fragment) => ({
    //     url: `hard-skills/list?skill=${encodeURIComponent(fragment)}`,
    //   }),
    // }),
    // updateHardSkill: builder.mutation<
    //   HardSkillInterface,
    //   { id: string; data: CreateHardSkillInterface }
    // >({
    //   query: ({ id, data }) => ({
    //     url: `hard-skills/${id}`,
    //     method: 'PUT',
    //     body: data,
    //   }),
    //   invalidatesTags: [{ type: 'hard-skills', id: 'LIST' }],
    // }),
  }),
});

export const { useGetTasksInfiniteQuery, useAddTaskMutation } = tasksApi;
