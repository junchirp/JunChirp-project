import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'crypto';

@Injectable()
export class CsrfSessionIdMiddleware implements NestMiddleware {
  public constructor(private readonly configService: ConfigService) {}

  public use(req: Request, res: Response, next: NextFunction): void {
    const cookieName =
      this.configService.get('NODE_ENV') === 'production'
        ? '__Host-session-id'
        : '_session-id';
    let sessionId = req.cookies[cookieName];

    if (!sessionId) {
      sessionId = randomUUID();
      req.cookies[cookieName] = sessionId;
      res.cookie(cookieName, sessionId, {
        httpOnly: true,
        secure: this.configService.get('NODE_ENV') === 'production',
        sameSite: 'lax',
      });
    }

    next();
  }
}
