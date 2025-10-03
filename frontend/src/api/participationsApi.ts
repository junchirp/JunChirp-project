import mainApi from './mainApi';

export const participationsApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    inviteUser: builder.mutation({
      query: (data) => ({
        url: 'participations/invite',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'invites', id: 'LIST' }],
    }),
    rejectInvite: builder.mutation({
      query: (id) => ({
        url: `participations/invite/${id}/reject`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'invites', id: 'LIST' }],
    }),
    acceptInvite: builder.mutation({
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
} = participationsApi;
