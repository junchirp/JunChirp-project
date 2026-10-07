import { ApiProperty } from '@nestjs/swagger';
import { TaskStatusResponseDto } from './task-status.response-dto';

export class TaskStatusWithCountResponseDto extends TaskStatusResponseDto {
  @ApiProperty({
    example: 7,
    description: 'Tasks count',
  })
  public readonly tasksCount!: number;
}
