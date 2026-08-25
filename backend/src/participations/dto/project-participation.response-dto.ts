import { ApiProperty } from '@nestjs/swagger';
import { ProjectRoleWithProjectResponseDto } from '../../project-roles/dto/project-role-with-project.response-dto';
import { ParticipationStatus } from '@prisma/client';

export class ProjectParticipationResponseDto {
  @ApiProperty({
    example: 'a4d4eb0c-1a10-455e-b9e9-1af147a77762',
    description: 'Unique identifier',
  })
  public readonly id: string;

  @ApiProperty({
    example: 'a4d4eb0c-1a10-455e-b9e9-1af147a77762',
    description: 'Unique identifier',
  })
  public readonly userId: string;

  @ApiProperty({
    example: 'rejected',
    description: 'Status of the request / invite',
  })
  public readonly status: ParticipationStatus;

  @ApiProperty({
    example: '2025-04-11 11:51:05.224',
    description: 'Creation date and time',
  })
  public readonly createdAt: Date;

  @ApiProperty({
    example: '2025-04-11 11:51:05.224',
    description: 'Acceptation date and time',
    type: Date,
    nullable: true,
  })
  public readonly acceptedAt: Date | null;

  @ApiProperty({
    example: '2025-04-11 11:51:05.224',
    description: 'Reservation date and time',
    type: Date,
    nullable: true,
  })
  public readonly reservedAt: Date | null;

  @ApiProperty({
    example: '2025-04-11 11:51:05.224',
    description: 'Cancellation date and time',
    type: Date,
    nullable: true,
  })
  public readonly canceledAt: Date | null;

  @ApiProperty({
    example: '2025-04-11 11:51:05.224',
    description: 'Rejection date and time',
    type: Date,
    nullable: true,
  })
  public readonly rejectedAt: Date | null;

  @ApiProperty({ type: () => ProjectRoleWithProjectResponseDto })
  public readonly projectRole: ProjectRoleWithProjectResponseDto;
}
