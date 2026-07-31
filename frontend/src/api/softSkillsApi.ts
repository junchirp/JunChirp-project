import mainApi from './mainApi';
import { SoftSkillInterface } from '@/shared/interfaces/soft-skill.interface';
import { CreateSoftSkillInterface } from '@/shared/interfaces/create-soft-skill.interface';

export const softSkillsApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getSoftSkills: builder.query<SoftSkillInterface[], void>({
      query: () => ({
        url: 'soft-skills',
      }),
      providesTags: [{ type: 'soft-skills', id: 'LIST' }],
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
    getSoftSkillsList: builder.query<string[], string>({
      query: (fragment) => ({
        url: `soft-skills/list?skill=${encodeURIComponent(fragment)}`,
      }),
    }),
    updateSoftSkill: builder.mutation<
      SoftSkillInterface,
      { id: string; data: CreateSoftSkillInterface }
    >({
      query: ({ id, data }) => ({
        url: `soft-skills/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: [{ type: 'soft-skills', id: 'LIST' }],
    }),
  }),
});

export const {
  useAddSoftSkillMutation,
  useDeleteSoftSkillMutation,
  useGetSoftSkillsQuery,
  useLazyGetSoftSkillsListQuery,
  useUpdateSoftSkillMutation,
} = softSkillsApi;
