import mainApi from './mainApi';
import { ProjectRoleTypeInterface } from '@/shared/interfaces/project-role-type.interface';
import { ProjectRoleInterface } from '@/shared/interfaces/project-role.interface';
import { CreateProjectRoleInterface } from '@/shared/interfaces/create-project-role.interface';

export const projectRolesApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjectRolesList: builder.query<ProjectRoleTypeInterface[], void>({
      query: () => ({
        url: 'project-roles/list',
      }),
      keepUnusedDataFor: 3600 * 24,
    }),
    addProjectRole: builder.mutation<
      ProjectRoleInterface,
      CreateProjectRoleInterface
    >({
      query: (data) => ({
        url: 'project-roles',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, data) => [
        { type: 'projects', id: data.projectId },
        { type: 'project-cards', id: 'LIST' },
        { type: 'project-cards', id: data.projectId },
        { type: 'my-projects', id: 'LIST' },
      ],
    }),
    addSlot: builder.mutation<
      ProjectRoleInterface,
      { id: string; projectId: string }
    >({
      query: ({ id }) => ({
        url: `project-roles/${id}/slots`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, { projectId }) => [
        { type: 'projects', id: projectId },
        { type: 'project-cards', id: 'LIST' },
        { type: 'project-cards', id: projectId },
        { type: 'my-projects', id: 'LIST' },
      ],
    }),
    deleteSlot: builder.mutation<void, { id: string; projectId: string }>({
      query: ({ id }) => ({
        url: `project-roles/${id}/slots`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { projectId }) => [
        { type: 'projects', id: projectId },
        { type: 'project-cards', id: 'LIST' },
        { type: 'project-cards', id: projectId },
        { type: 'my-projects', id: 'LIST' },
        { type: 'requests', id: projectId },
        { type: 'invites', id: projectId },
      ],
    }),
  }),
});

export const {
  useLazyGetProjectRolesListQuery,
  useGetProjectRolesListQuery,
  useAddProjectRoleMutation,
  useAddSlotMutation,
  useDeleteSlotMutation,
} = projectRolesApi;
