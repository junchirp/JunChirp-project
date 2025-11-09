import mainApi from './mainApi';
import { SocialInterface } from '@/shared/interfaces/social.interface';
import { CreateSocialInterface } from '@/shared/interfaces/create-social.interface';

export const socialsApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getSocials: builder.query<SocialInterface[], undefined>({
      query: () => ({
        url: 'socials',
      }),
      providesTags: ['socials'],
    }),
    addSocial: builder.mutation<SocialInterface, CreateSocialInterface>({
      query: (data) => ({
        url: 'socials',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['socials'],
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
      invalidatesTags: ['socials'],
    }),
    deleteSocial: builder.mutation<string, string>({
      query: (id) => ({
        url: `socials/${id}`,
        method: 'DELETE',
        responseHandler: (response): Promise<string> => response.text(),
      }),
      invalidatesTags: ['socials'],
    }),
  }),
});

export const {
  useAddSocialMutation,
  useDeleteSocialMutation,
  useUpdateSocialMutation,
  useGetSocialsQuery,
} = socialsApi;
