import mainApi from './mainApi';
import { usersApi } from './usersApi';
import { UserParticipationInterface } from '../shared/interfaces/user-participation.interface';
import { CreateInviteInterface } from '../shared/interfaces/create-invite.interface';
import { ProjectParticipationInterface } from '../shared/interfaces/project-participation.interface';
import { CreateRequestInterface } from '../shared/interfaces/create-request.interface';

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
      invalidatesTags: [{ type: 'invites', id: 'LIST' }],
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
      invalidatesTags: [
        { type: 'requests', id: 'LIST' },
        { type: 'my-requests', id: 'LIST' },
      ],
    }),
    rejectInvite: builder.mutation<void, string>({
      query: (id) => ({
        url: `participations/invite/${id}/reject`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'invites', id: 'LIST' }],
    }),
    acceptInvite: builder.mutation<void, string>({
      query: (id) => ({
        url: `participations/invite/${id}/accept`,
        method: 'PUT',
      }),
      invalidatesTags: [
        { type: 'invites', id: 'LIST' },
        { type: 'my-projects', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useInviteUserMutation,
  useAcceptInviteMutation,
  useRejectInviteMutation,
  useCreateRequestMutation,
} = participationsApi;
