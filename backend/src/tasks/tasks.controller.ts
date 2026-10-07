import {
  Controller,
  Get,
  Post,
  Body,
  // Delete,
  // Put,
  // HttpCode,
  // HttpStatus,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
// import { UpdateTaskDto } from './dto/update-task.dto';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiHeader,
  // ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Member } from '../auth/decorators/member.decorator';
import { TaskResponseDto } from './dto/task.response-dto';
// import { UpdateStatusTaskDto } from './dto/update-status-task.dto';
import { User } from '../auth/decorators/user.decorator';
import { UUIDParam } from '../common/decorators/UUID-param.decorator';
import { TaskListResponseDto } from './dto/task-list.response-dto';
import { CursorPaginationDto } from '../common/dto/cursor-pagination.dto';

@User('discord')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('tasks')
export class TasksController {
  public constructor(private readonly tasksService: TasksService) {}

  @Member('body', 'taskStatusId', 'taskStatus')
  @ApiOperation({ summary: 'Create task' })
  @ApiCreatedResponse({ type: TaskResponseDto })
  @ApiNotFoundResponse({
    description: 'Task status not found / Assignee not found',
  })
  @ApiForbiddenResponse({
    description:
      'Access denied: you are not a participant of this project / Access denied: email not confirmed / Access denied: discord not confirmed / Access denied: user is not a member of the Discord guild / Invalid CSRF token',
  })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @Post('')
  public async createTask(
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<TaskResponseDto> {
    return this.tasksService.createTask(createTaskDto);
  }

  // @Member('params', 'id', 'task')
  // @ApiOperation({ summary: 'Get task by id' })
  // @ApiOkResponse({ type: TaskWithStatusResponseDto })
  // @ApiNotFoundResponse({ description: 'Task not found' })
  // @ApiForbiddenResponse({
  //   description:
  //     'Access denied: you are not a participant of this project / Access denied: email not confirmed / Access denied: discord not confirmed / Access denied: user is not a member of the Discord guild',
  // })
  // @Get(':id')
  // public async getTaskById(
  //   @UUIDParam('id') id: string,
  // ): Promise<TaskWithStatusResponseDto> {
  //   return this.tasksService.getTaskById(id);
  // }

  // @Member('params', 'id', 'task')
  // @ApiOperation({ summary: 'Update task' })
  // @ApiOkResponse({ type: TaskWithStatusResponseDto })
  // @ApiNotFoundResponse({ description: 'Task not found' })
  // @ApiForbiddenResponse({
  //   description:
  //     'Access denied: you are not a participant of this project / Access denied: email not confirmed / Access denied: discord not confirmed / Access denied: user is not a member of the Discord guild / Invalid CSRF token',
  // })
  // @ApiHeader({
  //   name: 'x-csrf-token',
  //   description: 'CSRF token for the request',
  //   required: true,
  // })
  // @Put(':id')
  // public async updateTask(
  //   @UUIDParam('id') id: string,
  //   @Body() updateTaskDto: UpdateTaskDto,
  // ): Promise<TaskWithStatusResponseDto> {
  //   return this.tasksService.updateTask(id, updateTaskDto);
  // }

  // @Member('params', 'id', 'task')
  // @ApiOperation({ summary: 'Delete task' })
  // @ApiNoContentResponse()
  // @ApiNotFoundResponse({ description: 'Task not found' })
  // @ApiForbiddenResponse({
  //   description:
  //     'Access denied: you are not a participant of this project / Access denied: email not confirmed / Access denied: discord not confirmed / Access denied: user is not a member of the Discord guild / Invalid CSRF token',
  // })
  // @ApiHeader({
  //   name: 'x-csrf-token',
  //   description: 'CSRF token for the request',
  //   required: true,
  // })
  // @HttpCode(HttpStatus.NO_CONTENT)
  // @Delete(':id')
  // public async deleteTask(@UUIDParam('id') id: string): Promise<void> {
  //   return this.tasksService.deleteTask(id);
  // }

  // @Member('params', 'id', 'task')
  // @ApiOperation({ summary: 'Update task status' })
  // @ApiOkResponse({ type: TaskWithStatusResponseDto })
  // @ApiNotFoundResponse({
  //   description: 'Task or status not found',
  // })
  // @ApiForbiddenResponse({
  //   description:
  //     'Access denied: you are not a participant of this project / Access denied: email not confirmed / Access denied: discord not confirmed / Access denied: user is not a member of the Discord guild / Invalid CSRF token',
  // })
  // @ApiHeader({
  //   name: 'x-csrf-token',
  //   description: 'CSRF token for the request',
  //   required: true,
  // })
  // @Put(':id/status')
  // public async updateTaskStatus(
  //   @UUIDParam('id') id: string,
  //   @Body() updateStatusTaskDto: UpdateStatusTaskDto,
  // ): Promise<TaskWithStatusResponseDto> {
  //   return this.tasksService.updateTaskStatus(id, updateStatusTaskDto);
  // }

  // @Member('params', 'id', 'task')
  // @ApiOperation({ summary: 'Get task by id' })
  // @ApiOkResponse({ type: TaskWithStatusResponseDto })
  // @ApiNotFoundResponse({ description: 'Task not found' })
  // @ApiForbiddenResponse({
  //   description:
  //     'Access denied: you are not a participant of this project / Access denied: email not confirmed / Access denied: discord not confirmed / Access denied: user is not a member of the Discord guild',
  // })
  // @Get(':id')
  // public async getTaskById(
  //   @UUIDParam('id') id: string,
  // ): Promise<TaskWithStatusResponseDto> {
  //   return this.tasksService.getTaskById(id);
  // }

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
}
