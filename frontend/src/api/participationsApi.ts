import mainApi from './mainApi';
import { CreateInviteInterface } from '@/shared/interfaces/create-invite.interface';
import { ProjectParticipationInterface } from '@/shared/interfaces/project-participation.interface';
import { CreateRequestInterface } from '@/shared/interfaces/create-request.interface';
import { UserParticipationInterface } from '@/shared/interfaces/user-participation.interface';

export const participationsApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    inviteUser: builder.mutation<
      ProjectParticipationInterface,
      CreateInviteInterface
    >({
      query: (data) => ({
        url: 'participations/invite',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data: newInvite } = await queryFulfilled;
          dispatch(
            participationsApi.util.updateQueryData(
              'getUserInvitesInMyProjects',
              arg.userId,
              (draft: ProjectParticipationInterface[]) => {
                draft.push(newInvite);
              },
            ),
          );
        } catch {
          return;
        }
      },
      invalidatesTags: (_result, _error, { projectId, userId }) => [
        { type: 'invites-in-my-projects', id: 'LIST' },
        { type: 'invites-in-my-projects', id: userId },
        { type: 'invites', id: projectId },
      ],
    }),
    createRequest: builder.mutation<
      ProjectParticipationInterface,
      CreateRequestInterface & { userId: string }
    >({
      query: (data) => ({
        url: 'participations/request',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data: newRequest } = await queryFulfilled;
          dispatch(
            participationsApi.util.updateQueryData(
              'getMyRequests',
              arg.userId,
              (draft: ProjectParticipationInterface[]) => {
                draft.push(newRequest);
              },
            ),
          );
        } catch {
          return;
        }
      },
      invalidatesTags: [{ type: 'my-requests-in-projects', id: 'LIST' }],
    }),
    rejectInvite: builder.mutation<void, { id: string; userId: string }>({
      query: ({ id }) => ({
        url: `participations/invite/${id}/decline`,
        method: 'DELETE',
      }),
      async onQueryStarted(
        { id: inviteId, userId },
        { dispatch, queryFulfilled },
      ) {
        try {
          await queryFulfilled;
          dispatch(
            participationsApi.util.updateQueryData(
              'getMyInvites',
              userId,
              (draft: ProjectParticipationInterface[]) => {
                const index = draft.findIndex(
                  (invite) => invite.id === inviteId,
                );
                if (index !== -1) {
                  draft.splice(index, 1);
                }
              },
            ),
          );
        } catch {
          return;
        }
      },
      invalidatesTags: [{ type: 'invites-me-in-projects', id: 'LIST' }],
    }),
    acceptInvite: builder.mutation<void, string>({
      query: (id) => ({
        url: `participations/invite/${id}/accept`,
        method: 'PUT',
      }),
      invalidatesTags: [
        { type: 'invites-me-in-projects', id: 'LIST' },
        { type: 'my-projects', id: 'LIST' },
      ],
    }),
    acceptRequest: builder.mutation<
      void,
      { id: string; userId: string; projectId: string }
    >({
      query: ({ id }) => ({
        url: `participations/request/${id}/accept`,
        method: 'PUT',
      }),
      async onQueryStarted(
        { id: requestId, userId },
        { dispatch, queryFulfilled },
      ) {
        try {
          await queryFulfilled;
          dispatch(
            participationsApi.util.updateQueryData(
              'getUserRequestsInMyProjects',
              userId,
              (draft: ProjectParticipationInterface[]) => {
                const index = draft.findIndex(
                  (request) => request.id === requestId,
                );
                if (index !== -1) {
                  draft.splice(index, 1);
                }
              },
            ),
          );
        } catch {
          return;
        }
      },
      invalidatesTags: (_result, _error, { userId, projectId }) => [
        { type: 'users', id: userId },
        { type: 'user-projects', id: userId },
        { type: 'requests-in-my-projects', id: 'LIST' },
        { type: 'requests-in-my-projects', id: userId },
        { type: 'requests', id: projectId },
        { type: 'projects', id: projectId },
      ],
    }),
    declineRequest: builder.mutation<
      void,
      { id: string; userId: string; projectId: string }
    >({
      query: ({ id }) => ({
        url: `participations/request/${id}/decline`,
        method: 'DELETE',
      }),
      async onQueryStarted(
        { id: requestId, userId },
        { dispatch, queryFulfilled },
      ) {
        try {
          await queryFulfilled;
          dispatch(
            participationsApi.util.updateQueryData(
              'getUserRequestsInMyProjects',
              userId,
              (draft: ProjectParticipationInterface[]) => {
                const index = draft.findIndex(
                  (request) => request.id === requestId,
                );
                if (index !== -1) {
                  draft.splice(index, 1);
                }
              },
            ),
          );
        } catch {
          return;
        }
      },
      invalidatesTags: (_result, _error, { projectId, userId }) => [
        { type: 'requests-in-my-projects', id: 'LIST' },
        { type: 'requests-in-my-projects', id: userId },
        { type: 'requests', id: projectId },
      ],
    }),
    cancelRequest: builder.mutation<void, { id: string; userId: string }>({
      query: ({ id }) => ({
        url: `participations/request/${id}/cancel`,
        method: 'DELETE',
      }),
      async onQueryStarted(
        { id: requestId, userId },
        { dispatch, queryFulfilled },
      ) {
        try {
          await queryFulfilled;
          dispatch(
            participationsApi.util.updateQueryData(
              'getMyRequests',
              userId,
              (draft: ProjectParticipationInterface[]) => {
                const index = draft.findIndex(
                  (request) => request.id === requestId,
                );
                if (index !== -1) {
                  draft.splice(index, 1);
                }
              },
            ),
          );
        } catch {
          return;
        }
      },
      invalidatesTags: [{ type: 'my-requests-in-projects', id: 'LIST' }],
    }),
    cancelInvite: builder.mutation<
      void,
      { id: string; userId: string; projectId: string }
    >({
      query: ({ id }) => ({
        url: `participations/invite/${id}/cancel`,
        method: 'DELETE',
      }),
      async onQueryStarted(
        { id: inviteId, userId },
        { dispatch, queryFulfilled },
      ) {
        try {
          await queryFulfilled;
          dispatch(
            participationsApi.util.updateQueryData(
              'getUserInvitesInMyProjects',
              userId,
              (draft: ProjectParticipationInterface[]) => {
                const index = draft.findIndex(
                  (invite) => invite.id === inviteId,
                );
                if (index !== -1) {
                  draft.splice(index, 1);
                }
              },
            ),
          );
        } catch {
          return;
        }
      },
      invalidatesTags: (_result, _error, { projectId, userId }) => [
        { type: 'invites-in-my-projects', id: 'LIST' },
        { type: 'invites', id: projectId },
        { type: 'invites-in-my-projects', id: userId },
      ],
    }),
    getInvitesInMyProjects: builder.query<
      ProjectParticipationInterface[],
      string
    >({
      query: () => {
        return {
          url: 'participations/invites',
        };
      },
      providesTags: [{ type: 'invites-in-my-projects', id: 'LIST' }],
    }),
    getRequestsInMyProjects: builder.query<
      ProjectParticipationInterface[],
      string
    >({
      query: () => {
        return {
          url: 'participations/requests',
        };
      },
      providesTags: [{ type: 'requests-in-my-projects', id: 'LIST' }],
    }),

    getMyInvites: builder.query<ProjectParticipationInterface[], string>({
      query: () => {
        return {
          url: 'participations/me/invites',
        };
      },
      providesTags: [{ type: 'invites-me-in-projects', id: 'LIST' }],
    }),
    getMyRequests: builder.query<ProjectParticipationInterface[], string>({
      query: () => {
        return {
          url: 'participations/me/requests',
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
          url: `participations/users/${id}/requests`,
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
          url: `participations/users/${id}/invites`,
        };
      },
      providesTags: (_result, _error, id) => [
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
        { type: 'project-cards', id },
        { type: 'projects', id },
        { type: 'my-projects', id: 'LIST' },
        { type: 'users', id: 'LIST' },
        { type: 'users', id: userId },
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
  useDeclineRequestMutation,
  useAcceptRequestMutation,
  useCancelRequestMutation,
  useCancelInviteMutation,
  useGetInvitesInMyProjectsQuery,
  useGetRequestsInMyProjectsQuery,
  useGetMyInvitesQuery,
  useGetMyRequestsQuery,
  useGetUserRequestsInMyProjectsQuery,
  useGetUserInvitesInMyProjectsQuery,
  useLeaveProjectMutation,
  useGetInvitesByProjectIdQuery,
  useGetRequestsByProjectIdQuery,
  useDeleteUserFromProjectMutation,
} = participationsApi;
