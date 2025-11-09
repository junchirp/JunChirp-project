import mainApi from './mainApi';
import { SoftSkillInterface } from '@/shared/interfaces/soft-skill.interface';
import { CreateSoftSkillInterface } from '@/shared/interfaces/create-soft-skill.interface';

export const softSkillsApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getSoftSkills: builder.query<SoftSkillInterface[], undefined>({
      query: () => ({
        url: 'soft-skills',
      }),
      providesTags: ['soft-skills'],
    }),
    addSoftSkill: builder.mutation<
      SoftSkillInterface,
      CreateSoftSkillInterface
    >({
      query: (data) => ({
        url: 'soft-skills',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['soft-skills'],
    }),
    deleteSoftSkill: builder.mutation<string, string>({
      query: (id) => ({
        url: `soft-skills/${id}`,
        method: 'DELETE',
        responseHandler: (response): Promise<string> => response.text(),
      }),
      invalidatesTags: ['soft-skills'],
    }),
  }),
});

export const {
  useAddSoftSkillMutation,
  useDeleteSoftSkillMutation,
  useGetSoftSkillsQuery,
} = softSkillsApi;
