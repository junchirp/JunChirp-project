import mainApi from './mainApi';
import { ProjectRoleTypeInterface } from '@/shared/interfaces/project-role-type.interface';

export const projectRolesApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjectRolesList: builder.query<ProjectRoleTypeInterface[], undefined>({
      query: () => ({
        url: 'project-roles/list',
      }),
      keepUnusedDataFor: 3600 * 24,
    }),
  }),
});

export const { useLazyGetProjectRolesListQuery, useGetProjectRolesListQuery } =
  projectRolesApi;
