import mainApi from './mainApi';
import { SocialInterface } from '../shared/interfaces/social.interface';
import { CreateSocialInterface } from '../shared/interfaces/create-social.interface';

export const socialsApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    addSocial: builder.mutation<SocialInterface, CreateSocialInterface>({
      query: (data) => ({
        url: 'socials',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'socials', id: 'LIST' }],
    }),
    updateSocial: builder.mutation<
      SocialInterface,
      { id: string; data: CreateSocialInterface }
    >({
      query: ({ id, data }) => ({
        url: `socials/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, args) => [
        { type: 'socials', id: args.id },
      ],
    }),
    deleteSocial: builder.mutation<string, string>({
      query: (id) => ({
        url: `socials/${id}`,
        method: 'DELETE',
        responseHandler: (response): Promise<string> => response.text(),
      }),
      invalidatesTags: [{ type: 'socials', id: 'LIST' }],
    }),
  }),
});

export const {
  useAddSocialMutation,
  useDeleteSocialMutation,
  useUpdateSocialMutation,
} = socialsApi;
