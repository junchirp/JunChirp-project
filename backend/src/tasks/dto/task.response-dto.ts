import { ApiProperty } from '@nestjs/swagger';
import { TaskPriority } from '@prisma/client';
import { UserBaseResponseDto } from '../../users/dto/user-base.response-dto';
import { TaskStatusResponseDto } from '../../boards/dto/task-status.response-dto';

export class TaskResponseDto {
  @ApiProperty({
    example: 'a4d4eb0c-1a10-455e-b9e9-1af147a77762',
    description: 'Unique identifier',
  })
  public readonly id!: string;

  @ApiProperty({
    example: 'Task name',
    description: 'Task name',
  })
  public readonly taskName!: string;

  @ApiProperty({
    example: 'Task description',
    description: 'Task description',
    nullable: true,
    type: String,
  })
  public readonly description!: string | null;

  @ApiProperty({
    example: 'high',
    description: 'Task priority',
  })
  public readonly priority!: TaskPriority;

  @ApiProperty({
    example: 2,
    description: 'Task index in the column',
  })
  public readonly taskIndex!: number;

  @ApiProperty({
    example: '2025-04-11 11:51:05.224',
    description: 'Task deadline',
    nullable: true,
    type: Date,
  })
  public readonly deadline!: Date | null;

  @ApiProperty({
    type: () => [UserBaseResponseDto],
  })
  public readonly assignees!: UserBaseResponseDto[];

  @ApiProperty({
    type: () => TaskStatusResponseDto,
  })
  public readonly taskStatus!: TaskStatusResponseDto;
}
