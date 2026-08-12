import mainApi from './mainApi';
import { UsersListInterface } from '@/shared/interfaces/users-list.interface';
import { UsersFiltersInterface } from '@/shared/interfaces/users-filters.interface';
import { UserInterface } from '@/shared/interfaces/user.interface';

export const usersApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UsersListInterface, UsersFiltersInterface>({
      query: (params) => {
        const query = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
          if (value == null) {
            return;
          }

          if (Array.isArray(value)) {
            value.forEach((v) => query.append(key, v.toString()));
          } else {
            query.set(key, value.toString());
          }
        });

        return {
          url: `users?${query.toString()}`,
        };
      },
      providesTags: [{ type: 'users', id: 'LIST' }],
    }),
    getUserById: builder.query<UserInterface, string>({
      query: (id: string) => {
        return {
          url: `users/${id}`,
        };
      },
      providesTags: (_result, _error, id) => [{ type: 'users', id }],
    }),
  }),
});

export const { useGetUsersQuery, useGetUserByIdQuery } = usersApi;
