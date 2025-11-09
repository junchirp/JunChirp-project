import { OmitType } from '@nestjs/swagger';
import { UserResponseDto } from './user.response-dto';

export class AuthResponseDto extends OmitType(UserResponseDto, [
  'educations',
  'softSkills',
  'hardSkills',
  'socials',
]) {}
