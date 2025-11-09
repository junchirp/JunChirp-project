import { ApiProperty, PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateUserDto extends PickType(CreateUserDto, [
  'firstName',
  'lastName',
]) {
  @ApiProperty({
    example: ['e960a0fb-891a-4f02-9f39-39ac3bb08621'],
    description: 'Role types IDs',
  })
  @IsArray({ message: 'Must be an array of IDs' })
  @IsUUID(4, { message: 'Must be a string in UUIDv4 format', each: true })
  @IsNotEmpty({ message: 'Role type ID is required', each: true })
  public readonly desiredRolesIds: string[];
}
