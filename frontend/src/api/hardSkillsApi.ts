import mainApi from './mainApi';
import { HardSkillInterface } from '@/shared/interfaces/hard-skill.interface';
import { CreateHardSkillInterface } from '@/shared/interfaces/create-hard-skill.interface';

export const hardSkillsApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getHardSkills: builder.query<HardSkillInterface[], undefined>({
      query: () => ({
        url: 'hard-skills',
      }),
      providesTags: ['hard-skills'],
    }),
    addHardSkill: builder.mutation<
      HardSkillInterface,
      CreateHardSkillInterface
    >({
      query: (data) => ({
        url: 'hard-skills',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['hard-skills'],
    }),
    deleteHardSkill: builder.mutation<string, string>({
      query: (id) => ({
        url: `hard-skills/${id}`,
        method: 'DELETE',
        responseHandler: (response): Promise<string> => response.text(),
      }),
      invalidatesTags: ['hard-skills'],
    }),
    getHardSkillsList: builder.query<string[], string>({
      query: (fragment) => ({
        url: `hard-skills/list?skill=${encodeURIComponent(fragment)}`,
      }),
    }),
  }),
});

export const {
  useAddHardSkillMutation,
  useDeleteHardSkillMutation,
  useGetHardSkillsQuery,
  useLazyGetHardSkillsListQuery,
} = hardSkillsApi;
