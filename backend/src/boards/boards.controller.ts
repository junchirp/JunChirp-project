import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Put,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
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
import { Owner } from '../auth/decorators/owner.decorator';
import { Member } from '../auth/decorators/member.decorator';
import { UpdateColumnsOrderDto } from './dto/update-columns-order.dto';
import { BoardResponseDto } from './dto/board.response-dto';
import { User } from '../auth/decorators/user.decorator';
import { UUIDParam } from '../common/decorators/UUID-param.decorator';
import { LocaleDto } from '../common/dto/locale.dto';

@User('discord')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('boards')
export class BoardsController {
  public constructor(private readonly boardsService: BoardsService) {}

  @Owner('body', 'projectId', 'project')
  @ApiOperation({ summary: 'Add a board' })
  @ApiCreatedResponse({ type: BoardResponseDto })
  @ApiBadRequestResponse({
    description: 'You can only add up to 5 boards in the project',
  })
  @ApiConflictResponse({ description: 'Board with this name already exists' })
  @ApiForbiddenResponse({
    description:
      'Access denied: you are not the project owner / Access denied: email not confirmed / Access denied: discord not confirmed / Invalid CSRF token',
  })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @Post('')
  public async addBoard(
    @Body() createBoardDto: CreateBoardDto,
  ): Promise<BoardResponseDto> {
    return this.boardsService.addBoard(createBoardDto);
  }

  @Member('params', 'id', 'board')
  @ApiOperation({ summary: 'Get board by id' })
  @ApiOkResponse({ type: BoardResponseDto })
  @ApiNotFoundResponse({ description: 'Board not found' })
  @ApiForbiddenResponse({
    description:
      'Access denied: you are not a participant of this project / Access denied: email not confirmed / Access denied: discord not confirmed',
  })
  @Get(':id')
  public async getBoardById(
    @UUIDParam('id') id: string,
  ): Promise<BoardResponseDto> {
    return this.boardsService.getBoardById(id);
  }

  @Owner('params', 'id', 'board')
  @ApiOperation({ summary: 'Update board name' })
  @ApiOkResponse({ type: BoardResponseDto })
  @ApiNotFoundResponse({ description: 'Board not found' })
  @ApiConflictResponse({ description: 'Board with this name already exists' })
  @ApiForbiddenResponse({
    description:
      'Access denied: you are not the project owner / Access denied: email not confirmed / Access denied: discord not confirmed / Invalid CSRF token',
  })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @Put(':id')
  public async updateBoard(
    @UUIDParam('id') id: string,
    @Body() updateBoardDto: UpdateBoardDto,
  ): Promise<BoardResponseDto> {
    return this.boardsService.updateBoard(id, updateBoardDto);
  }

  @Owner('params', 'id', 'board')
  @ApiOperation({ summary: 'Delete board' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'Board not found' })
  @ApiBadRequestResponse({
    description: 'A project must have at least one board',
  })
  @ApiForbiddenResponse({
    description:
      'Access denied: you are not the project owner / Access denied: email not confirmed / Access denied: discord not confirmed / Invalid CSRF token',
  })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  public async deleteBoard(@UUIDParam('id') id: string): Promise<void> {
    return this.boardsService.deleteBoard(id);
  }

  @Owner('params', 'id', 'board')
  @ApiOperation({ summary: 'Update board columns order' })
  @ApiOkResponse({ type: BoardResponseDto })
  @ApiNotFoundResponse({ description: 'Board not found' })
  @ApiBadRequestResponse({
    description: `Column with id does not belong to the board / 
                  Columns list must match existing columns exactly / 
                  Indices must not be repeated / 
                  Indices must be between 1 and max`,
  })
  @ApiForbiddenResponse({
    description:
      'Access denied: you are not the project owner / Access denied: email not confirmed / Access denied: discord not confirmed / Invalid CSRF token',
  })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @Patch(':id/reorder-columns')
  public async updateColumnsOrder(
    @UUIDParam('id') id: string,
    @Body() updateColumnsOrderDto: UpdateColumnsOrderDto,
  ): Promise<BoardResponseDto> {
    return this.boardsService.updateColumnsOrder(id, updateColumnsOrderDto);
  }

  @Owner('params', 'id', 'board')
  @ApiOperation({ summary: 'Copy the board' })
  @ApiCreatedResponse({ type: BoardResponseDto })
  @ApiBadRequestResponse({
    description: 'You can only add up to 5 boards in the project',
  })
  @ApiConflictResponse({ description: 'Board with this name already exists' })
  @ApiNotFoundResponse({ description: 'Board not found' })
  @ApiForbiddenResponse({
    description:
      'Access denied: you are not the project owner / Access denied: email not confirmed / Access denied: discord not confirmed / Invalid CSRF token',
  })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @Post(':id/copy')
  public async duplicateBoard(
    @UUIDParam('id') id: string,
    @Body() localeDto: LocaleDto,
  ): Promise<BoardResponseDto> {
    return this.boardsService.duplicateBoard(id, localeDto);
  }
}

// @User('discord')
// @ApiUnauthorizedResponse({ description: 'Unauthorized' })
// @ApiForbiddenResponse({
//   description:
//     'Access denied: you are not the project owner / Access denied: email not confirmed / Access denied: discord not confirmed / Invalid CSRF token',
// })
// @Controller('task-statuses')
// export class TaskStatusesController {
//   public constructor(
//     private readonly taskStatusesService: TaskStatusesService,
//   ) {}
//
//   @Owner('body', 'boardId', 'board')
//   @ApiOperation({ summary: 'Add task status' })
//   @ApiCreatedResponse({ type: TaskStatusResponseDto })
//   @ApiBadRequestResponse({
//     description: 'You can only add up to 5 columns on the board',
//   })
//   @ApiNotFoundResponse({ description: 'Board not found' })
//   @ApiConflictResponse({
//     description: 'Column name must be unique on the board',
//   })
//   @ApiHeader({
//     name: 'x-csrf-token',
//     description: 'CSRF token for the request',
//     required: true,
//   })
//   @Post('')
//   public async addTaskStatus(
//     @Body() createTaskStatusDto: CreateTaskStatusDto,
//   ): Promise<TaskStatusResponseDto> {
//     return this.taskStatusesService.addTaskStatus(createTaskStatusDto);
//   }
//
//   @Owner('params', 'id', 'taskStatus')
//   @ApiOperation({ summary: 'Update status name' })
//   @ApiOkResponse({ type: TaskStatusResponseDto })
//   @ApiNotFoundResponse({ description: 'Column not found' })
//   @ApiConflictResponse({
//     description: 'Column name must be unique on the board',
//   })
//   @ApiHeader({
//     name: 'x-csrf-token',
//     description: 'CSRF token for the request',
//     required: true,
//   })
//   @Put(':id')
//   public async updateTaskStatus(
//     @UUIDParam('id') id: string,
//     @Body() updateTaskStatusDto: UpdateTaskStatusDto,
//   ): Promise<TaskStatusResponseDto> {
//     return this.taskStatusesService.updateTaskStatus(id, updateTaskStatusDto);
//   }
//
//   @Owner('params', 'id', 'taskStatus')
//   @ApiOperation({ summary: 'Delete status' })
//   @ApiNoContentResponse()
//   @ApiNotFoundResponse({ description: 'Column not found' })
//   @ApiHeader({
//     name: 'x-csrf-token',
//     description: 'CSRF token for the request',
//     required: true,
//   })
//   @HttpCode(HttpStatus.NO_CONTENT)
//   @Delete(':id')
//   public async deleteTaskStatus(@UUIDParam('id') id: string): Promise<void> {
//     return this.taskStatusesService.deleteTaskStatus(id);
//   }
// }
