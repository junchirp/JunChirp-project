import mainApi from './mainApi';
import { CreateInviteInterface } from '@/shared/interfaces/create-invite.interface';
import { ProjectParticipationInterface } from '@/shared/interfaces/project-participation.interface';
import { CreateRequestInterface } from '@/shared/interfaces/create-request.interface';
import { UserParticipationInterface } from '@/shared/interfaces/user-participation.interface';
import { RequestsListInterface } from '@/shared/interfaces/requests-list.interface';
import { InvitesListInterface } from '@/shared/interfaces/invites-list.interface';
import { ParticipationsQueryInterface } from '@/shared/interfaces/participations-query.interface';

export const participationsApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    inviteUser: builder.mutation<
      ProjectParticipationInterface,
      CreateInviteInterface
    >({
      query: (data) => ({
        url: 'participations/invites',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, { projectId, userId }) => [
        { type: 'invites-in-my-projects', id: userId },
        { type: 'invites', id: projectId },
        { type: 'users', id: userId },
        { type: 'users', id: 'LIST' },
      ],
    }),
    createRequest: builder.mutation<
      ProjectParticipationInterface,
      CreateRequestInterface
    >({
      query: (data) => ({
        url: 'participations/requests',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, { projectId }) => [
        { type: 'my-requests-in-projects', id: 'LIST' },
        { type: 'project-cards', id: 'LIST' },
        { type: 'project-cards', id: projectId },
      ],
    }),
    rejectInvite: builder.mutation<void, { id: string; projectId: string }>({
      query: ({ id }) => ({
        url: `participations/invites/${id}/reject`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, { projectId }) => [
        { type: 'invites-me-in-projects', id: 'LIST' },
        { type: 'project-cards', id: 'LIST' },
        { type: 'project-cards', id: projectId },
      ],
    }),
    acceptInvite: builder.mutation<void, { id: string; projectId: string }>({
      query: ({ id }) => ({
        url: `participations/invites/${id}/accept`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, { projectId }) => [
        { type: 'invites-me-in-projects', id: 'LIST' },
        { type: 'my-projects', id: 'LIST' },
        { type: 'project-cards', id: 'LIST' },
        { type: 'projects', id: projectId },
      ],
    }),
    acceptRequest: builder.mutation<
      void,
      { id: string; userId: string; projectId: string }
    >({
      query: ({ id }) => ({
        url: `participations/requests/${id}/accept`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, { userId, projectId }) => [
        { type: 'users', id: userId },
        { type: 'users', id: 'LIST' },
        { type: 'user-projects', id: userId },
        { type: 'requests-in-my-projects', id: userId },
        { type: 'requests', id: projectId },
        { type: 'projects', id: projectId },
        { type: 'project-cards', id: 'LIST' },
      ],
    }),
    rejectRequest: builder.mutation<
      void,
      { id: string; userId: string; projectId: string }
    >({
      query: ({ id }) => ({
        url: `participations/requests/${id}/reject`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, { projectId, userId }) => [
        { type: 'requests-in-my-projects', id: userId },
        { type: 'requests', id: projectId },
        { type: 'users', id: userId },
        { type: 'users', id: 'LIST' },
      ],
    }),
    cancelRequest: builder.mutation<void, { id: string; projectId: string }>({
      query: ({ id }) => ({
        url: `participations/requests/${id}/cancel`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, { projectId }) => [
        { type: 'my-requests-in-projects', id: 'LIST' },
        { type: 'project-cards', id: 'LIST' },
        { type: 'project-cards', id: projectId },
      ],
    }),
    cancelInvite: builder.mutation<
      void,
      { id: string; userId: string; projectId: string }
    >({
      query: ({ id }) => ({
        url: `participations/invites/${id}/cancel`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, { projectId, userId }) => [
        { type: 'invites', id: projectId },
        { type: 'invites-in-my-projects', id: userId },
        { type: 'users', id: userId },
        { type: 'users', id: 'LIST' },
      ],
    }),
    getMyInvites: builder.query<
      InvitesListInterface,
      { id: string; params: ParticipationsQueryInterface }
    >({
      query: ({ params }) => {
        const query = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
          if (value == null) {
            return;
          }
          query.set(key, value.toString());
        });

        return {
          url: `participations/me/invites?${query.toString()}`,
        };
      },
      providesTags: [{ type: 'invites-me-in-projects', id: 'LIST' }],
    }),
    getMyRequests: builder.query<
      RequestsListInterface,
      { id: string; params: ParticipationsQueryInterface }
    >({
      query: ({ params }) => {
        const query = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
          if (value == null) {
            return;
          }
          query.set(key, value.toString());
        });

        return {
          url: `participations/me/requests?${query.toString()}`,
        };
      },
      providesTags: [{ type: 'my-requests-in-projects', id: 'LIST' }],
    }),
    getUserRequestsInMyProjects: builder.query<
      RequestsListInterface,
      { id: string; params: ParticipationsQueryInterface }
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
          url: `participations/users/${id}/requests?${query.toString()}`,
        };
      },
      providesTags: (_result, _error, { id }) => [
        { type: 'requests-in-my-projects', id },
      ],
    }),
    getUserInvitesInMyProjects: builder.query<
      InvitesListInterface,
      { id: string; params: ParticipationsQueryInterface }
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
          url: `participations/users/${id}/invites?${query.toString()}`,
        };
      },
      providesTags: (_result, _error, { id }) => [
        { type: 'invites-in-my-projects', id },
      ],
    }),
    getInvitesByProjectId: builder.query<UserParticipationInterface[], string>({
      query: (id) => {
        return {
          url: `participations/projects/${id}/invites`,
        };
      },
      providesTags: (_result, _error, id) => [{ type: 'invites', id }],
    }),
    getRequestsByProjectId: builder.query<UserParticipationInterface[], string>(
      {
        query: (id) => {
          return {
            url: `participations/projects/${id}/requests`,
          };
        },
        providesTags: (_result, _error, id) => [{ type: 'requests', id }],
      },
    ),
    deleteUserFromProject: builder.mutation<
      void,
      { id: string; userId: string }
    >({
      query: ({ id, userId }) => ({
        url: `participations/projects/${id}/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { id, userId }) => [
        { type: 'project-cards', id: 'LIST' },
        { type: 'projects', id },
        { type: 'users', id: 'LIST' },
        { type: 'users', id: userId },
        { type: 'user-projects', id: userId },
      ],
    }),
    leaveProject: builder.mutation<void, string>({
      query: (id) => ({
        url: `participations/projects/${id}/leave`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'project-cards', id: 'LIST' },
        { type: 'project-cards', id },
        { type: 'my-projects', id: 'LIST' },
        { type: 'auth', id: 'CURRENT' },
      ],
    }),
  }),
});

export const {
  useInviteUserMutation,
  useAcceptInviteMutation,
  useRejectInviteMutation,
  useCreateRequestMutation,
  useRejectRequestMutation,
  useAcceptRequestMutation,
  useCancelRequestMutation,
  useCancelInviteMutation,
  useGetMyInvitesQuery,
  useGetMyRequestsQuery,
  useGetUserRequestsInMyProjectsQuery,
  useGetUserInvitesInMyProjectsQuery,
  useLeaveProjectMutation,
  useGetInvitesByProjectIdQuery,
  useGetRequestsByProjectIdQuery,
  useDeleteUserFromProjectMutation,
} = participationsApi;
