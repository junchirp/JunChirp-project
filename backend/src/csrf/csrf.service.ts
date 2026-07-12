import { HttpStatus, Injectable } from '@nestjs/common';
import { doubleCsrf, DoubleCsrfUtilities } from 'csrf-csrf';
import { NextFunction, Request, Response } from 'express';
import { EBadCsrfTokenException } from '../common/exceptions/e-bad-csrf-token.exception';
import { ConfigService } from '@nestjs/config';
import { CsrfTokenResponseDto } from './dto/csrf-token.response-dto';
import { randomUUID } from 'crypto';
import { CookieConfigService } from '../common/services/cookie-config/cookie-config.service';

@Injectable()
export class CsrfService {
  private readonly csrf: DoubleCsrfUtilities;

  public constructor(
    private readonly configService: ConfigService,
    private readonly cookieService: CookieConfigService,
  ) {
    this.csrf = doubleCsrf({
      cookieName: cookieService.csrfCookieName,
      cookieOptions: cookieService.csrfCookieOptions,
      csrfTokenDelimiter: '%',
      getCsrfTokenFromRequest: (req: Request) => req.headers['x-csrf-token'],
      getSecret: () => configService.getOrThrow<string>('CSRF_SECRET'),
      getSessionIdentifier: (req: Request) =>
        req.cookies[this.cookieService.csrfSessionCookieName],
    });
  }

  public doubleCsrfProtection(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    this.csrf.doubleCsrfProtection(req, res, (err) => {
      if (err?.code === 'EBADCSRFTOKEN') {
        const exception = new EBadCsrfTokenException();
        return res.status(HttpStatus.FORBIDDEN).json(exception.getResponse());
      }

      return next(err);
    });
  }

  public generateToken(req: Request, res: Response): CsrfTokenResponseDto {
    return {
      csrfToken: this.csrf.generateCsrfToken(req, res, {
        validateOnReuse: true,
      }),
    };
  }

  public rotate(req: Request, res: Response): void {
    const sessionCookieName = this.cookieService.csrfSessionCookieName;
    const sessionId = randomUUID();

    req.cookies[sessionCookieName] = sessionId;

    res.cookie(
      sessionCookieName,
      sessionId,
      this.cookieService.baseCookieOptions,
    );

    this.csrf.generateCsrfToken(req, res, {
      validateOnReuse: true,
    });
  }
}
