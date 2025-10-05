import mainApi from './mainApi';
import { MessageInterface } from '../shared/interfaces/message.interface';
import { CreateSupportInterface } from '../shared/interfaces/create-support.interface';

export const supportApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    support: builder.mutation<MessageInterface, CreateSupportInterface>({
      query: (data) => ({
        url: 'support',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useSupportMutation } = supportApi;
