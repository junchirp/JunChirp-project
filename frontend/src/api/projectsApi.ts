import mainApi from './mainApi';
import { ProjectCategoryInterface } from '@/shared/interfaces/project-category.interface';
import { ProjectsListInterface } from '@/shared/interfaces/projects-list.interface';
import { ProjectsFiltersInterface } from '@/shared/interfaces/projects-filters.interface';
import { ProjectInterface } from '@/shared/interfaces/project.interface';

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
        providesTags: ['projects'],
      },
    ),
    getCategories: builder.query<ProjectCategoryInterface[], undefined>({
      query: () => {
        return {
          url: '/projects/categories',
        };
      },
    }),
    getProjectCardById: builder.query<
      ProjectInterface,
      { id: string; userId: string }
    >({
      query: ({ id }) => {
        return {
          url: `/projects/${id}/card`,
        };
      },
      providesTags: ['projects'],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetCategoriesQuery,
  useGetProjectCardByIdQuery,
} = projectsApi;
