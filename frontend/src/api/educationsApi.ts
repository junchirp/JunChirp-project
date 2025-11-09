import mainApi from './mainApi';
import { EducationInterface } from '@/shared/interfaces/education.interface';
import { CreateEducationInterface } from '@/shared/interfaces/create-education.interface';

export const educationsApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getEducations: builder.query<EducationInterface[], undefined>({
      query: () => ({
        url: 'educations',
      }),
      providesTags: ['educations'],
    }),
    getInstitutions: builder.query<string[], string>({
      query: (fragment) => ({
        url: `educations/institutions?institution=${encodeURIComponent(fragment)}`,
      }),
    }),
    getSpecializations: builder.query<string[], string>({
      query: (fragment) => ({
        url: `educations/specializations?specialization=${encodeURIComponent(fragment)}`,
      }),
    }),
    addEducation: builder.mutation<
      EducationInterface,
      CreateEducationInterface
    >({
      query: (data) => ({
        url: 'educations',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['educations'],
    }),
    updateEducation: builder.mutation<
      EducationInterface,
      { id: string; data: CreateEducationInterface }
    >({
      query: ({ id, data }) => ({
        url: `educations/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['educations'],
    }),
    deleteEducation: builder.mutation<string, string>({
      query: (id) => ({
        url: `educations/${id}`,
        method: 'DELETE',
        responseHandler: (response): Promise<string> => response.text(),
      }),
      invalidatesTags: ['educations'],
    }),
  }),
});

export const {
  useAddEducationMutation,
  useDeleteEducationMutation,
  useUpdateEducationMutation,
  useLazyGetInstitutionsQuery,
  useLazyGetSpecializationsQuery,
  useGetEducationsQuery,
} = educationsApi;
