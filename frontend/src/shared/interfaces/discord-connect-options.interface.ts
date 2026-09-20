import { DiscordErrorCodeType } from '@/shared/types/discord-error-code.type';

export interface DiscordConnectOptionsInterface {
  withWrapper: boolean;
  isCancelButton: boolean;
  errorCode: DiscordErrorCodeType;
}
