import { ApiProperty } from '@nestjs/swagger';
import { UserBaseResponseDto } from './user-base.response-dto';
import { RoleResponseDto } from '../../roles/dto/role.response-dto';

export class AuthResponseDto extends UserBaseResponseDto {
  @ApiProperty({
    example: '113273902301932041645',
    description: 'Google identifier',
    type: String,
    nullable: true,
  })
  public readonly googleId!: string | null;

  @ApiProperty({
    example: '113273902301932041645',
    description: 'Discord identifier',
    type: String,
    nullable: true,
  })
  public readonly discordId!: string | null;

  @ApiProperty({ example: 'email@mail.com', description: 'Email' })
  public readonly email!: string;

  @ApiProperty({ example: false, description: `Is user's email verified?` })
  public readonly isVerified!: boolean;

  @ApiProperty({ example: false, description: 'Is user blocked?' })
  public readonly isBlocked!: boolean;

  @ApiProperty({ type: () => RoleResponseDto })
  public readonly role!: RoleResponseDto;
}
