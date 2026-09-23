import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import { type AuthResponseDto } from '../../users/dto/auth.response-dto';

export const CurrentUser = createParamDecorator(
  (data: keyof AuthResponseDto | undefined, ctx: ExecutionContext) => {
    const { user } = ctx.switchToHttp().getRequest<{ user: AuthResponseDto }>();
    return data ? user?.[data] : user;
  },
);
