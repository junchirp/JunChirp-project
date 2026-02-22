import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleCallbackGuard extends AuthGuard('google') {
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (request.query?.error === 'access_denied') {
      return true;
    }

    return super.canActivate(context) as Promise<boolean>;
  }
}
