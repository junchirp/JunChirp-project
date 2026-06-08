import mainApi from './mainApi';
import { usersApi } from './usersApi';
import { CreateInviteInterface } from '@/shared/interfaces/create-invite.interface';
import { ProjectParticipationInterface } from '@/shared/interfaces/project-participation.interface';
import { CreateRequestInterface } from '@/shared/interfaces/create-request.interface';

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
            usersApi.util.updateQueryData(
              'getInvitesInMyProjects',
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
      invalidatesTags: (_result, _error, { projectId }) => [
        { type: 'invites-in-my-projects', id: 'LIST' },
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
            usersApi.util.updateQueryData(
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
            usersApi.util.updateQueryData(
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
            usersApi.util.updateQueryData(
              'getRequestsInMyProjects',
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
            usersApi.util.updateQueryData(
              'getRequestsInMyProjects',
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
      invalidatesTags: (_result, _error, { projectId }) => [
        { type: 'requests-in-my-projects', id: 'LIST' },
        { type: 'invites', id: projectId },
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
            usersApi.util.updateQueryData(
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
            usersApi.util.updateQueryData(
              'getInvitesInMyProjects',
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
      invalidatesTags: (_result, _error, { projectId }) => [
        { type: 'invites-in-my-projects', id: 'LIST' },
        { type: 'invites', id: projectId },
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
} = participationsApi;
