import mainApi from './mainApi';
import { usersApi } from './usersApi';
import { UserParticipationInterface } from '@/shared/interfaces/user-participation.interface';
import { CreateInviteInterface } from '@/shared/interfaces/create-invite.interface';
import { ProjectParticipationInterface } from '@/shared/interfaces/project-participation.interface';
import { CreateRequestInterface } from '@/shared/interfaces/create-request.interface';
import { triggerResetUserProjects } from '@/redux/ui/uiSlice';

export const participationsApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    inviteUser: builder.mutation<
      UserParticipationInterface,
      CreateInviteInterface
    >({
      query: (data) => ({
        url: 'participations/invite',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['invites-in-my-projects'],
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
              { userId: arg.userId },
              (draft: ProjectParticipationInterface[]) => {
                draft.push(newRequest);
              },
            ),
          );
        } catch {
          return;
        }
      },
      invalidatesTags: ['my-requests-in-projects'],
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
              { userId },
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
      invalidatesTags: ['invites-me-in-projects'],
    }),
    acceptInvite: builder.mutation<void, string>({
      query: (id) => ({
        url: `participations/invite/${id}/accept`,
        method: 'PUT',
      }),
      invalidatesTags: [
        'invites-me-in-projects',
        { type: 'my-projects', id: 'LIST' },
      ],
    }),
    acceptRequest: builder.mutation<void, { id: string; userId: string }>({
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
          dispatch(triggerResetUserProjects());
        } catch {
          return;
        }
      },
      invalidatesTags: [
        'requests-in-my-projects',
        'user',
        { type: 'user-projects', id: 'LIST' },
      ],
    }),
    rejectRequest: builder.mutation<void, { id: string; userId: string }>({
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
      invalidatesTags: ['requests-in-my-projects'],
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
              { userId },
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
      invalidatesTags: ['my-requests-in-projects'],
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
} = participationsApi;
