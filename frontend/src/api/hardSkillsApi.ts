import mainApi from './mainApi';
import { HardSkillInterface } from '@/shared/interfaces/hard-skill.interface';
import { CreateHardSkillInterface } from '@/shared/interfaces/create-hard-skill.interface';

export const hardSkillsApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getHardSkills: builder.query<HardSkillInterface[], void>({
      query: () => ({
        url: 'hard-skills',
      }),
      providesTags: [{ type: 'hard-skills', id: 'LIST' }],
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
      invalidatesTags: [{ type: 'hard-skills', id: 'LIST' }],
    }),
    deleteHardSkill: builder.mutation<string, string>({
      query: (id) => ({
        url: `hard-skills/${id}`,
        method: 'DELETE',
        responseHandler: (response): Promise<string> => response.text(),
      }),
      invalidatesTags: [{ type: 'hard-skills', id: 'LIST' }],
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
