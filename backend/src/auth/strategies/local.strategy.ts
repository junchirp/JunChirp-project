import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Request } from 'express';
import { AuthResponseDto } from '../../users/dto/auth.response-dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  public constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  public async validate(
    req: Request,
    email: string,
    password: string,
  ): Promise<AuthResponseDto> {
    return this.authService.validateUser(req, { email, password });
  }
}
