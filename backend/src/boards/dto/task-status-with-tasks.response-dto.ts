import { ApiProperty, OmitType } from '@nestjs/swagger';
import { TaskResponseDto } from '../../tasks/dto/task.response-dto';
import { TaskStatusResponseDto } from './task-status.response-dto';

export class TaskStatusWithTasksResponseDto extends OmitType(
  TaskStatusResponseDto,
  ['tasksCount'],
) {
  @ApiProperty({
    type: [TaskResponseDto],
  })
  public readonly tasks: TaskResponseDto[];
}
