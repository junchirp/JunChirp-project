import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { randomUUID } from 'crypto';
import { RedisService } from '../../../redis/redis.service';

@Injectable()
export class DiscordInitGuard extends AuthGuard('discord') {
  public constructor(private redisService: RedisService) {
    super();
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const user = request.user;
    const state = randomUUID();
    const returnUrl = request.query.returnUrl ?? '/';
    const locale = request.query.locale ?? 'ua';

    await this.redisService.set(
      state,
      JSON.stringify({ userId: user.id, returnUrl, locale }),
      300,
    );

    request.state = state;

    return super.canActivate(context) as Promise<boolean>;
  }

  public getAuthenticateOptions(context: ExecutionContext): {
    scope: string[];
    state: string;
  } {
    const request = context.switchToHttp().getRequest();
    return {
      scope: ['identify', 'guilds.join'],
      state: request.state,
    };
  }
}
