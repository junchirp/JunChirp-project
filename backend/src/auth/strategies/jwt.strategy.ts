import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { Request } from 'express';
import { AuthResponseDto } from '../../users/dto/auth.response-dto';
import { TokenPayloadInterface } from '../../common/interfaces/token-payload.interface';
import { CookieConfigService } from '../../cookie-config/cookie-config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  public constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
    private readonly cookieService: CookieConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request): string | null =>
          req.cookies?.[cookieService.accessTokenCookieName],
      ]),
      secretOrKey: configService.get<string>('JWT_SECRET') as string,
    });
  }

  public async validate(
    payload: TokenPayloadInterface,
  ): Promise<AuthResponseDto> {
    return await this.userService.getUserById(payload.sub, 'edit');
  }
}
