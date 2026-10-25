import mainApi from './mainApi';
import { DeveloperInterface } from '@/shared/interfaces/developer.interface';

export const developersApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getDevelopers: builder.query<DeveloperInterface[], void>({
      query: () => ({
        url: 'developers',
      }),
    }),
  }),
});

export const { useGetDevelopersQuery } = developersApi;
