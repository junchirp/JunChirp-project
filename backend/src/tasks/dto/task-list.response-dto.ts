import { ApiProperty } from '@nestjs/swagger';
import { TaskResponseDto } from './task.response-dto';

export class TaskListResponseDto {
  @ApiProperty({
    type: () => [TaskResponseDto],
  })
  public readonly tasks!: TaskResponseDto[];

  @ApiProperty({
    example: 123,
    description: 'Pagination cursor',
    nullable: true,
    type: Number,
  })
  public readonly cursor!: number | null;
}
