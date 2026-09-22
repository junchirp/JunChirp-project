import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { USER_GUARD_KEY, UserCheckType } from '../../decorators/user.decorator';
import { DiscordService } from '../../../discord/discord.service';

@Injectable()
export class UserGuard implements CanActivate {
  public constructor(
    private readonly reflector: Reflector,
    private readonly discordService: DiscordService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const check: UserCheckType =
      this.reflector.getAllAndOverride<UserCheckType>(USER_GUARD_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? 'email';
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('User not found in request');
    }

    if (!user.isVerified) {
      throw new ForbiddenException('Access denied: email not confirmed');
    }

    if (check === 'discord') {
      if (!user.discordId) {
        throw new ForbiddenException({
          code: 'DISCORD_NOT_CONNECTED',
          message: 'Access denied: discord not confirmed',
        });
      }

      const exists = await this.discordService.userExists(
        user.id,
        user.discordId,
      );

      if (!exists) {
        throw new ForbiddenException({
          code: 'DISCORD_NOT_CONNECTED',
          message: 'Access denied: discord not confirmed',
        });
      }

      const isGuildMember = await this.discordService.isGuildMember(
        user.discordId,
      );

      if (!isGuildMember) {
        throw new ForbiddenException({
          code: 'DISCORD_NOT_IN_GUILD',
          message: 'Access denied: user is not a member of the Discord guild',
        });
      }
    }

    return true;
  }
}
