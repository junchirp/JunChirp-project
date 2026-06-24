import mainApi from './mainApi';
import { UsersListInterface } from '@/shared/interfaces/users-list.interface';
import { UsersFiltersInterface } from '@/shared/interfaces/users-filters.interface';
import { ProjectsListInterface } from '@/shared/interfaces/projects-list.interface';
import { UserInterface } from '@/shared/interfaces/user.interface';
import { ProjectsFiltersInterface } from '@/shared/interfaces/projects-filters.interface';
import { ProjectParticipationInterface } from '@/shared/interfaces/project-participation.interface';

export const usersApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UsersListInterface, UsersFiltersInterface>({
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
      providesTags: [{ type: 'users', id: 'LIST' }],
    }),
    getMyProjects: builder.query<ProjectsListInterface, string>({
      query: () => {
        return {
          url: '/users/me/projects?status=active',
        };
      },
      providesTags: [{ type: 'my-projects', id: 'LIST' }],
    }),
    getUserById: builder.query<UserInterface, string>({
      query: (id: string) => {
        return {
          url: `/users/${id}`,
        };
      },
      providesTags: (_result, _error, id) => [{ type: 'users', id }],
    }),
    getUserProjects: builder.query<
      ProjectsListInterface,
      { id: string; params: ProjectsFiltersInterface }
    >({
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
      providesTags: (_result, _error, { id }) => [
        { type: 'user-projects', id },
      ],
    }),
    getMyInvites: builder.query<ProjectParticipationInterface[], string>({
      query: () => {
        return {
          url: 'users/me/invites',
        };
      },
      providesTags: [{ type: 'invites-me-in-projects', id: 'LIST' }],
    }),
    getMyRequests: builder.query<ProjectParticipationInterface[], string>({
      query: () => {
        return {
          url: 'users/me/requests',
        };
      },
      providesTags: [{ type: 'my-requests-in-projects', id: 'LIST' }],
    }),
    getUserRequestsInMyProjects: builder.query<
      ProjectParticipationInterface[],
      string
    >({
      query: (id) => {
        return {
          url: `users/${id}/requests`,
        };
      },
      providesTags: (_result, _error, id) => [
        { type: 'requests-in-my-projects', id },
      ],
    }),
    getUserInvitesInMyProjects: builder.query<
      ProjectParticipationInterface[],
      string
    >({
      query: (id) => {
        return {
          url: `users/${id}/invites`,
        };
      },
      providesTags: (_result, _error, id) => [
        { type: 'invites-in-my-projects', id },
      ],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetMyProjectsQuery,
  useGetUserByIdQuery,
  useGetUserProjectsQuery,
  useGetMyInvitesQuery,
  useGetMyRequestsQuery,
  useGetUserRequestsInMyProjectsQuery,
  useGetUserInvitesInMyProjectsQuery,
} = usersApi;
