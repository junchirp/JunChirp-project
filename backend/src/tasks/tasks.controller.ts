import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import {
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
import { TaskWithStatusResponseDto } from './dto/task-with-status.response-dto';
import { UpdateStatusTaskDto } from './dto/update-status-task.dto';
import { User } from '../auth/decorators/user.decorator';
import { UUIDParam } from '../common/decorators/UUID-param.decorator';

@User('discord')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('tasks')
export class TasksController {
  public constructor(private readonly tasksService: TasksService) {}

  @Member('body', 'taskStatusId', 'taskStatus')
  @ApiOperation({ summary: 'Create task' })
  @ApiCreatedResponse({ type: TaskWithStatusResponseDto })
  @ApiNotFoundResponse({
    description: 'Task status not found',
  })
  @ApiForbiddenResponse({
    description:
      'Access denied: you are not a participant of this project / Access denied: email not confirmed / Access denied: discord not confirmed / Invalid CSRF token',
  })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @Post('')
  public async createTask(
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<TaskWithStatusResponseDto> {
    return this.tasksService.createTask(createTaskDto);
  }

  @Member('params', 'id', 'task')
  @ApiOperation({ summary: 'Get task by id' })
  @ApiOkResponse({ type: TaskWithStatusResponseDto })
  @ApiNotFoundResponse({ description: 'Task not found' })
  @ApiForbiddenResponse({
    description:
      'Access denied: you are not a participant of this project / Access denied: email not confirmed / Access denied: discord not confirmed',
  })
  @Get(':id')
  public async getTaskById(
    @UUIDParam('id') id: string,
  ): Promise<TaskWithStatusResponseDto> {
    return this.tasksService.getTaskById(id);
  }

  @Member('params', 'id', 'task')
  @ApiOperation({ summary: 'Update task' })
  @ApiOkResponse({ type: TaskWithStatusResponseDto })
  @ApiNotFoundResponse({ description: 'Task not found' })
  @ApiForbiddenResponse({
    description:
      'Access denied: you are not a participant of this project / Access denied: email not confirmed / Access denied: discord not confirmed / Invalid CSRF token',
  })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @Put(':id')
  public async updateTask(
    @UUIDParam('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<TaskWithStatusResponseDto> {
    return this.tasksService.updateTask(id, updateTaskDto);
  }

  @Member('params', 'id', 'task')
  @ApiOperation({ summary: 'Delete task' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'Task not found' })
  @ApiForbiddenResponse({
    description:
      'Access denied: you are not a participant of this project / Access denied: email not confirmed / Access denied: discord not confirmed / Invalid CSRF token',
  })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  public async deleteTask(@UUIDParam('id') id: string): Promise<void> {
    return this.tasksService.deleteTask(id);
  }

  @Member('params', 'id', 'task')
  @ApiOperation({ summary: 'Update task status' })
  @ApiOkResponse({ type: TaskWithStatusResponseDto })
  @ApiNotFoundResponse({
    description: 'Task or status not found',
  })
  @ApiForbiddenResponse({
    description:
      'Access denied: you are not a participant of this project / Access denied: email not confirmed / Access denied: discord not confirmed / Invalid CSRF token',
  })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @Put(':id/status')
  public async updateTaskStatus(
    @UUIDParam('id') id: string,
    @Body() updateStatusTaskDto: UpdateStatusTaskDto,
  ): Promise<TaskWithStatusResponseDto> {
    return this.tasksService.updateTaskStatus(id, updateStatusTaskDto);
  }

  // @Owner('body', 'boardId', 'board')
  // @ApiOperation({ summary: 'Add task status' })
  // @ApiCreatedResponse({ type: TaskStatusResponseDto })
  // @ApiBadRequestResponse({
  //   description: 'You can only add up to 5 columns on the board',
  // })
  // @ApiNotFoundResponse({ description: 'Board not found' })
  // @ApiConflictResponse({
  //   description: 'Column name must be unique on the board',
  // })
  // @ApiHeader({
  //   name: 'x-csrf-token',
  //   description: 'CSRF token for the request',
  //   required: true,
  // })
  // @Post('')
  // public async addTaskStatus(
  //   @Body() createTaskStatusDto: CreateTaskStatusDto,
  // ): Promise<TaskStatusResponseDto> {
  //   return this.taskStatusesService.addTaskStatus(createTaskStatusDto);
  // }
  //
  // @Owner('params', 'id', 'taskStatus')
  // @ApiOperation({ summary: 'Update status name' })
  // @ApiOkResponse({ type: TaskStatusResponseDto })
  // @ApiNotFoundResponse({ description: 'Column not found' })
  // @ApiConflictResponse({
  //   description: 'Column name must be unique on the board',
  // })
  // @ApiHeader({
  //   name: 'x-csrf-token',
  //   description: 'CSRF token for the request',
  //   required: true,
  // })
  // @Put(':id')
  // public async updateTaskStatus(
  //   @UUIDParam('id') id: string,
  //   @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  // ): Promise<TaskStatusResponseDto> {
  //   return this.taskStatusesService.updateTaskStatus(id, updateTaskStatusDto);
  // }
  //
  // @Owner('params', 'id', 'taskStatus')
  // @ApiOperation({ summary: 'Delete status' })
  // @ApiNoContentResponse()
  // @ApiNotFoundResponse({ description: 'Column not found' })
  // @ApiHeader({
  //   name: 'x-csrf-token',
  //   description: 'CSRF token for the request',
  //   required: true,
  // })
  // @HttpCode(HttpStatus.NO_CONTENT)
  // @Delete(':id')
  // public async deleteTaskStatus(@UUIDParam('id') id: string): Promise<void> {
  //   return this.taskStatusesService.deleteTaskStatus(id);
  // }
}
