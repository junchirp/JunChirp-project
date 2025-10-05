import mainApi from './mainApi';
import { ProjectRoleTypeInterface } from '../shared/interfaces/project-role-type.interface';

export const projectRolesApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjectRolesList: builder.query<ProjectRoleTypeInterface[], undefined>({
      query: () => ({
        url: 'project-roles/list',
      }),
      providesTags: ['project-roles-list'],
    }),
  }),
});

export const { useLazyGetProjectRolesListQuery } = projectRolesApi;
