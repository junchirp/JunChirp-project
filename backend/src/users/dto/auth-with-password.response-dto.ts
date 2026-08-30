import { ApiProperty } from '@nestjs/swagger';
import { AuthResponseDto } from './auth.response-dto';

export class AuthWithPasswordResponseDto extends AuthResponseDto {
  @ApiProperty({ example: 'q1we5?!ER234', description: 'Password' })
  public readonly password!: string;
}
