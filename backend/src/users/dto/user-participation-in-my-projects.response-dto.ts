import { ApiProperty } from '@nestjs/swagger';

export class UserParticipationInMyProjectsResponseDto {
  @ApiProperty({
    example: 2,
    description: 'Active participations count in current user`s projects',
  })
  public participationsCount: number;

  @ApiProperty({
    example: 2,
    description: 'Active requests count in current user`s projects',
  })
  public activeRequestsCount: number;

  @ApiProperty({
    example: 2,
    description: 'Active invitations count in current user`s projects',
  })
  public activeInvitesCount: number;
}
