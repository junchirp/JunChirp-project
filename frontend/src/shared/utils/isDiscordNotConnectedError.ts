export function isDiscordNotConnectedError(error?: unknown): boolean {
  return !!(
    error &&
    typeof error === 'object' &&
    'data' in error &&
    error.data &&
    typeof error.data === 'object' &&
    'code' in error.data &&
    error.data.code === 'DISCORD_NOT_CONNECTED'
  );
}
