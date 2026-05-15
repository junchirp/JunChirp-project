import { applyDecorators, UseGuards } from '@nestjs/common';
import { User } from './user.decorator';
import { NoMemberGuard } from '../guards/no-member/no-member.guard';

export const NoMember = (): MethodDecorator & ClassDecorator =>
  applyDecorators(User(), UseGuards(NoMemberGuard));
