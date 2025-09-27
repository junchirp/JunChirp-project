import mainApi from './mainApi';
import { ProjectCategoryInterface } from '../shared/interfaces/project-category.interface';

export const projectsApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query({
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
    }),
    getCategories: builder.query<ProjectCategoryInterface[], undefined>({
      query: () => {
        return {
          url: '/projects/categories',
        };
      },
    }),
  }),
});

export const { useGetProjectsQuery, useGetCategoriesQuery } = projectsApi;
