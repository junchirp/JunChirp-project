import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { AuthResponseDto } from '../../users/dto/auth.response-dto';

export const CurrentUser = createParamDecorator(
  (data: keyof AuthResponseDto | undefined, ctx: ExecutionContext) => {
    const { user } = ctx.switchToHttp().getRequest<{ user: AuthResponseDto }>();
    return data ? user?.[data] : user;
  },
);
