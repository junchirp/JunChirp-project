import mainApi from './mainApi';
import { UsersListInterface } from '../shared/interfaces/users-list.interface';
import { UsersFiltersInterface } from '../shared/interfaces/users-filters.interface';
import { ProjectsListInterface } from '../shared/interfaces/projects-list.interface';
import { UserInterface } from '../shared/interfaces/user.interface';
import { ProjectsFiltersInterface } from '../shared/interfaces/projects-filters.interface';
import { ProjectParticipationInterface } from '../shared/interfaces/project-participation.interface';

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
      providesTags: ['users'],
    }),
    getMyProjects: builder.query<
      ProjectsListInterface,
      { userId: string } | undefined
    >({
      query: () => {
        return {
          url: '/users/me/projects?status=active',
        };
      },
      providesTags: ['my-projects'],
    }),
    getUserById: builder.query<UserInterface, string>({
      query: (id: string) => {
        return {
          url: `/users/${id}`,
        };
      },
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
    }),
    getMyInvites: builder.query<
      ProjectParticipationInterface[],
      { userId: string } | undefined
    >({
      query: () => {
        return {
          url: 'users/me/invites',
        };
      },
      providesTags: ['my-invites'],
    }),
    getMyRequests: builder.query<
      ProjectParticipationInterface[],
      { userId: string } | undefined
    >({
      query: () => {
        return {
          url: 'users/me/requests',
        };
      },
      providesTags: ['my-requests'],
    }),
    getMyInviteById: builder.query<
      ProjectParticipationInterface,
      { inviteId: string; userId: string | undefined }
    >({
      query: ({ inviteId }) => {
        return {
          url: `/users/me/invites/${inviteId}`,
        };
      },
      providesTags: ['my-invites'],
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
  useGetMyInviteByIdQuery,
} = usersApi;
