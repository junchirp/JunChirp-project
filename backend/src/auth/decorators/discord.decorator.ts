import { applyDecorators, UseGuards } from '@nestjs/common';
import { User } from './user.decorator';
import { DiscordInitGuard } from '../guards/discord-init/discord-init.guard';
import { DiscordCallbackGuard } from '../guards/discord-callback/discord-callback.guard';

type DiscordMode = 'init' | 'callback';

export const Discord = (
  mode: DiscordMode = 'init',
): MethodDecorator & ClassDecorator => {
  const guard = mode === 'init' ? DiscordInitGuard : DiscordCallbackGuard;

  return applyDecorators(User(), UseGuards(guard));
};
