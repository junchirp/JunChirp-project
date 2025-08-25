import mainApi from './mainApi';

export const usersApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (params) => {
        const query = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
          if (value == null) {
            return;
          }

          if (Array.isArray(value)) {
            value.forEach((v) => query.append(key, v.toString()));
          } else {
            query.set(key, value.toString());
          }
        });

        return {
          url: `/users?${query.toString()}`,
        };
      },
      providesTags: ['users'],
    }),
    getMyProjects: builder.query({
      query: () => {
        return {
          url: '/users/me/projects?status=active',
        };
      },
      providesTags: ['my-projects'],
    }),
    getUserById: builder.query({
      query: (id: string) => {
        return {
          url: `/users/${id}`,
        };
      },
    }),
    getUserProjects: builder.query({
      query: ({ id, params }) => {
        const query = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value == null) {
            return;
          }

          query.set(key, value.toString());
        });
        return {
          url: `/users/${id}/projects?${query.toString()}`,
        };
      },
    }),
  }),
});

export const {
  useGetUsersQuery,
  useLazyGetMyProjectsQuery,
  useGetUserByIdQuery,
  useGetUserProjectsQuery,
} = usersApi;
