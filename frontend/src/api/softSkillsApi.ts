import mainApi from './mainApi';
import { SoftSkillInterface } from '@/shared/interfaces/soft-skill.interface';
import { CreateSoftSkillInterface } from '@/shared/interfaces/create-soft-skill.interface';

export const softSkillsApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    addSoftSkill: builder.mutation<
      SoftSkillInterface,
      CreateSoftSkillInterface
    >({
      query: (data) => ({
        url: 'soft-skills',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'soft-skills', id: 'LIST' }],
    }),
    deleteSoftSkill: builder.mutation<string, string>({
      query: (id) => ({
        url: `soft-skills/${id}`,
        method: 'DELETE',
        responseHandler: (response): Promise<string> => response.text(),
      }),
      invalidatesTags: [{ type: 'soft-skills', id: 'LIST' }],
    }),
  }),
});

export const { useAddSoftSkillMutation, useDeleteSoftSkillMutation } =
  softSkillsApi;
