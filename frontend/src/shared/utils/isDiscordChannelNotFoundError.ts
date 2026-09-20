export function isDiscordChannelNotFoundError(error?: unknown): boolean {
  return !!(
    error &&
    typeof error === 'object' &&
    'data' in error &&
    error.data &&
    typeof error.data === 'object' &&
    'code' in error.data &&
    error.data.code === 'DISCORD_CHANNEL_NOT_FOUND'
  );
}
