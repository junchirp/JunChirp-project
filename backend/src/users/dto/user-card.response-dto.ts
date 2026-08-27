import { ApiProperty } from '@nestjs/swagger';
import { UserParticipationInMyProjectsResponseDto } from './user-participation-in-my-projects.response-dto';
import { UserBaseResponseDto } from './user-base.response-dto';

export class UserCardResponseDto extends UserBaseResponseDto {
  @ApiProperty({ type: () => UserParticipationInMyProjectsResponseDto })
  public readonly projectParticipationSummary: UserParticipationInMyProjectsResponseDto;
}
