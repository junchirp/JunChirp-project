import mainApi from './mainApi';

export const discordApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    checkDiscord: builder.query<void, void>({
      query: () => ({
        url: 'discord/me/check',
      }),
    }),
    checkDiscordChannel: builder.query<void, string>({
      query: (id) => ({
        url: `discord/projects/${id}/channel/check`,
      }),
    }),
  }),
});

export const {
  useCheckDiscordQuery,
  useLazyCheckDiscordQuery,
  useLazyCheckDiscordChannelQuery,
} = discordApi;
