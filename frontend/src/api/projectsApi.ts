import mainApi from './mainApi';
import { ProjectCategoryInterface } from '@/shared/interfaces/project-category.interface';
import { ProjectsListInterface } from '@/shared/interfaces/projects-list.interface';
import { ProjectsFiltersInterface } from '@/shared/interfaces/projects-filters.interface';
import { ProjectInterface } from '@/shared/interfaces/project.interface';
import { CreateProjectInterface } from '@/shared/interfaces/create-project.interface';
import { ProjectLogoInterface } from '@/shared/interfaces/project-logo.interface';

export const projectsApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<ProjectsListInterface, ProjectsFiltersInterface>(
      {
        query: (params) => {
          const query = new URLSearchParams();

          Object.entries(params).forEach(([key, value]) => {
            if (value == null) {
              return;
            }
            query.set(key, value.toString());
          });

          return {
            url: `/projects?${query.toString()}`,
          };
        },
        providesTags: [{ type: 'project-cards', id: 'LIST' }],
      },
    ),
    getCategories: builder.query<ProjectCategoryInterface[], void>({
      query: () => {
        return {
          url: '/projects/categories',
        };
      },
      keepUnusedDataFor: 3600 * 24,
    }),
    getProjectCardById: builder.query<ProjectInterface, string>({
      query: (id) => {
        return {
          url: `/projects/${id}/card`,
        };
      },
      providesTags: (_result, _error, id) => [{ type: 'project-cards', id }],
    }),
    getProjectById: builder.query<ProjectInterface, string>({
      query: (id) => {
        return {
          url: `/projects/${id}`,
        };
      },
      providesTags: (_result, _error, id) => [{ type: 'projects', id }],
    }),
    createProject: builder.mutation<ProjectInterface, CreateProjectInterface>({
      query: (data) => ({
        url: 'projects',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [
        { type: 'project-cards', id: 'LIST' },
        { type: 'my-projects', id: 'LIST' },
      ],
    }),
    updateProject: builder.mutation<
      ProjectInterface,
      { id: string; data: CreateProjectInterface }
    >({
      query: ({ id, data }) => ({
        url: `projects/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'project-cards', id: 'LIST' },
        { type: 'project-cards', id },
        { type: 'projects', id },
        { type: 'my-projects', id: 'LIST' },
      ],
    }),
    updateProjectLogo: builder.mutation<
      ProjectLogoInterface,
      { id: string; file: File }
    >({
      query: ({ id, file }) => {
        const formData = new FormData();

        formData.append('file', file);

        return {
          url: `/projects/${id}/logo`,
          method: 'PUT',
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'project-cards', id: 'LIST' },
        { type: 'project-cards', id },
        { type: 'projects', id },
        { type: 'my-projects', id: 'LIST' },
      ],
    }),
    deleteProjectLogo: builder.mutation<void, string>({
      query: (id) => ({
        url: `projects/${id}/logo`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'project-cards', id: 'LIST' },
        { type: 'project-cards', id },
        { type: 'projects', id },
        { type: 'my-projects', id: 'LIST' },
      ],
    }),
    leaveProject: builder.mutation<void, string>({
      query: (id) => ({
        url: `projects/${id}/leave`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'project-cards', id: 'LIST' },
        { type: 'project-cards', id },
        { type: 'my-projects', id: 'LIST' },
        { type: 'auth', id: 'CURRENT' },
      ],
    }),
    deleteProject: builder.mutation<void, string>({
      query: (id) => ({
        url: `projects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'project-cards', id: 'LIST' },
        { type: 'my-projects', id: 'LIST' },
        { type: 'auth', id: 'CURRENT' },
      ],
    }),
    completeProject: builder.mutation<ProjectInterface, string>({
      query: (id) => ({
        url: `projects/${id}/close`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'project-cards', id: 'LIST' },
        { type: 'projects', id },
        { type: 'my-projects', id: 'LIST' },
        { type: 'auth', id: 'CURRENT' },
      ],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetCategoriesQuery,
  useLazyGetCategoriesQuery,
  useGetProjectCardByIdQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useUpdateProjectLogoMutation,
  useDeleteProjectLogoMutation,
  useLeaveProjectMutation,
  useDeleteProjectMutation,
  useCompleteProjectMutation,
} = projectsApi;
