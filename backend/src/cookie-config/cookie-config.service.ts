import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieOptions } from 'express';

@Injectable()
export class CookieConfigService {
  public constructor(private readonly configService: ConfigService) {}

  private readonly EXPIRE_DAY_REFRESH_TOKEN = 1;

  private readonly EXPIRE_MINUTES_ACCESS_TOKEN = 5;

  public get expireSecRefreshToken(): number {
    return this.EXPIRE_DAY_REFRESH_TOKEN * 24 * 3600;
  }

  public get isProduction(): boolean {
    return this.configService.get<string>('NODE_ENV') === 'production';
  }

  public get accessTokenCookieName(): string {
    return this.isProduction ? '__Host-access-token' : 'access-token';
  }

  public get refreshTokenCookieName(): string {
    return this.isProduction ? '__Host-access-token' : 'refresh-token';
  }

  public get baseCookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: 'lax',
      path: '/',
    };
  }

  public get accessCookieOptions(): CookieOptions {
    return {
      ...this.baseCookieOptions,
      maxAge: this.EXPIRE_MINUTES_ACCESS_TOKEN * 60 * 1000,
    };
  }

  public get refreshCookieOptions(): CookieOptions {
    return {
      ...this.baseCookieOptions,
      maxAge: this.EXPIRE_DAY_REFRESH_TOKEN * 24 * 60 * 60 * 1000,
    };
  }

  public get csrfSessionCookieName(): string {
    return this.isProduction ? '__Host-session-id' : '_session-id';
  }

  public get csrfCookieName(): string {
    return this.isProduction ? '__Host-prod.x-csrf-token' : '_csrf';
  }

  public get csrfCookieOptions(): CookieOptions {
    return {
      httpOnly: false,
      secure: this.isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: this.configService.getOrThrow<number>('EXPIRE_TIME_CSRF_TOKEN'),
    };
  }
}
