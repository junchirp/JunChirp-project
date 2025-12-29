import mainApi from './mainApi';
import { ProjectCategoryInterface } from '@/shared/interfaces/project-category.interface';
import { ProjectsListInterface } from '@/shared/interfaces/projects-list.interface';
import { ProjectsFiltersInterface } from '@/shared/interfaces/projects-filters.interface';
import { ProjectInterface } from '@/shared/interfaces/project.interface';
import { CreateProjectInterface } from '@/shared/interfaces/create-project.interface';

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
        providesTags: [{ type: 'projects', id: 'LIST' }],
      },
    ),
    getCategories: builder.query<ProjectCategoryInterface[], undefined>({
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
      providesTags: (result, error, id) => [{ type: 'projects', id }],
    }),
    getProjectById: builder.query<ProjectInterface, string>({
      query: (id) => {
        return {
          url: `/projects/${id}`,
        };
      },
      providesTags: (result, error, id) => [{ type: 'projects', id }],
    }),
    createProject: builder.mutation<ProjectInterface, CreateProjectInterface>({
      query: (data) => ({
        url: 'projects',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'projects', id: 'LIST' }, 'my-projects'],
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
      invalidatesTags: (result, error, { id }) => [
        { type: 'projects', id: 'LIST' },
        { type: 'projects', id },
        'my-projects',
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
} = projectsApi;
