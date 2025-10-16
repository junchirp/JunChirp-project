import mainApi from './mainApi';
import { HardSkillInterface } from '@/shared/interfaces/hard-skill.interface';
import { CreateHardSkillInterface } from '@/shared/interfaces/create-hard-skill.interface';

export const hardSkillsApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
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
  }),
});

export const { useAddHardSkillMutation, useDeleteHardSkillMutation } =
  hardSkillsApi;
