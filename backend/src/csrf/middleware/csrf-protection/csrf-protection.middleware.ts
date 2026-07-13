import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { CsrfService } from '../../../csrf/csrf.service';

@Injectable()
export class CsrfProtectionMiddleware implements NestMiddleware {
  public constructor(private readonly csrfService: CsrfService) {}

  public use(req: Request, res: Response, nextFunc: NextFunction): void {
    this.csrfService.doubleCsrfProtection(req, res, nextFunc);
  }
}
