import mainApi from './mainApi';
import { TaskListInterface } from '@/shared/interfaces/task-list.interface';
import { CursorPaginationInterface } from '@/shared/interfaces/cursor-pagination.interface';
import { TaskInterface } from '@/shared/interfaces/task.interface';
import { CreateTaskInterface } from '@/shared/interfaces/create-task.interface';

export const tasksApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<
      TaskListInterface,
      { taskStatusId: string; params: CursorPaginationInterface }
    >({
      query: ({ taskStatusId, params }) => {
        const query = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value == null) {
            return;
          }
          query.set(key, value.toString());
        });

        return {
          url: `/tasks/${taskStatusId}?${query.toString()}`,
        };
      },
      providesTags: (_result, _error, { taskStatusId }) => [
        { type: 'tasks', id: taskStatusId },
      ],
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

export const { useGetTasksQuery, useAddTaskMutation } = tasksApi;
