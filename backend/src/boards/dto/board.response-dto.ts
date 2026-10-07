import { ApiProperty } from '@nestjs/swagger';
import { TaskStatusWithCountResponseDto } from './task-status-with-count.response-dto';

export class BoardResponseDto {
  @ApiProperty({
    example: 'a4d4eb0c-1a10-455e-b9e9-1af147a77762',
    description: 'Unique identifier',
  })
  public readonly id!: string;

  @ApiProperty({
    example: 'Board',
    description: 'Board name',
  })
  public readonly boardName!: string;

  @ApiProperty({
    example: '6446ff53-d993-46b3-a837-25d55fac1392',
    description: 'Project ID',
  })
  public readonly projectId!: string;

  @ApiProperty({ type: () => [TaskStatusWithCountResponseDto] })
  public readonly columns!: TaskStatusWithCountResponseDto[];
}
