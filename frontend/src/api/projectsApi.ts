import mainApi from './mainApi';

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
  }),
});

export const { useGetProjectsQuery } = projectsApi;
