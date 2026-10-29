import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Put,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Member } from '../auth/decorators/member.decorator';
import { TaskResponseDto } from './dto/task.response-dto';
import { User } from '../auth/decorators/user.decorator';
import { UUIDParam } from '../common/decorators/UUID-param.decorator';
import { TaskListResponseDto } from './dto/task-list.response-dto';
import { CursorPaginationDto } from '../common/dto/cursor-pagination.dto';
import { MoveTaskDto } from './dto/move-task.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@User('discord')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('tasks')
export class TasksController {
  public constructor(private readonly tasksService: TasksService) {}

  @Member('body', 'taskStatusId', 'taskStatus')
  @ApiOperation({ summary: 'Create task' })
  @ApiCreatedResponse({ type: TaskResponseDto })
  @ApiNotFoundResponse({
    description: 'Task status or assignee not found / Task status not found',
  })
  @ApiForbiddenResponse({
    description: `Access denied: you are not a participant of this project /
      Access denied: email not confirmed / Access denied: discord not confirmed /
      Access denied: user is not a member of the Discord guild / Invalid CSRF token /
      Cannot create a task in a completed project`,
  })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @Post('')
  public async createTask(
    @CurrentUser('id') id: string,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<TaskResponseDto> {
    return this.tasksService.createTask(id, createTaskDto);
  }

  @Member('params', 'id', 'task')
  @ApiOperation({ summary: 'Update task' })
  @ApiOkResponse({ type: TaskResponseDto })
  @ApiNotFoundResponse({
    description:
      'Task not found / Task status not found / Task status or assignee not found',
  })
  @ApiForbiddenResponse({
    description: `Access denied: you are not a participant of this project /
      Access denied: email not confirmed / Access denied: discord not confirmed /
      Access denied: user is not a member of the Discord guild / Invalid CSRF token /
      You are not allowed to edit this task / Cannot edit tasks in a completed project`,
  })
  @ApiBadRequestResponse({
    description: 'Task status must belong to the same board',
  })
  @ApiConflictResponse({
    description: 'Transaction conflict. Please try again',
  })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @Put(':id')
  public async updateTask(
    @UUIDParam('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    return this.tasksService.updateTask(id, userId, updateTaskDto);
  }

  @Member('params', 'id', 'task')
  @ApiOperation({ summary: 'Delete task' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'Task not found' })
  @ApiConflictResponse({
    description: 'Transaction conflict. Please try again',
  })
  @ApiForbiddenResponse({
    description: `Access denied: you are not a participant of this project /
      Access denied: email not confirmed / Access denied: discord not confirmed /
      Access denied: user is not a member of the Discord guild / Invalid CSRF token /
      You are not allowed to delete this task / Cannot delete tasks in a completed project`,
  })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  public async deleteTask(
    @UUIDParam('id') id: string,
    @CurrentUser('id') userId: string,
  ): Promise<void> {
    return this.tasksService.deleteTask(id, userId);
  }

  @Member('params', 'taskStatusId', 'taskStatus')
  @ApiOperation({ summary: 'Get tasks by status id with pagination' })
  @ApiOkResponse({ type: TaskListResponseDto })
  @ApiForbiddenResponse({
    description:
      'Access denied: you are not a participant of this project / Access denied: email not confirmed / Access denied: discord not confirmed / Access denied: user is not a member of the Discord guild',
  })
  @Get(':taskStatusId')
  public async getTaskById(
    @UUIDParam('taskStatusId') id: string,
    @Query() query: CursorPaginationDto,
  ): Promise<TaskListResponseDto> {
    return this.tasksService.getTasksByStatus(id, query);
  }

  @Member('params', 'id', 'task')
  @ApiOperation({ summary: 'Move task' })
  @ApiNoContentResponse()
  @ApiForbiddenResponse({
    description: `Access denied: you are not a participant of this project /
      Access denied: email not confirmed / Access denied: discord not confirmed /
      Access denied: user is not a member of the Discord guild / Invalid CSRF token /
      Cannot move tasks in a completed project`,
  })
  @ApiConflictResponse({
    description: 'Transaction conflict. Please try again',
  })
  @ApiNotFoundResponse({ description: 'Task not found' })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @Patch(':id/move')
  public async moveTask(
    @UUIDParam('id') id: string,
    @Body() moveTaskDto: MoveTaskDto,
  ): Promise<void> {
    return this.tasksService.moveTask(id, moveTaskDto);
  }
}
