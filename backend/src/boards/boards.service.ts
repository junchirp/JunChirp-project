import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { PrismaService } from '../prisma/prisma.service';
import { BoardMapper } from '../common/mappers/board.mapper';
import { UpdateColumnsOrderDto } from './dto/update-columns-order.dto';
import { DEFAULT_NAMES } from '../common/constants/default-names';
import { generateUniqName } from '../common/utils/generate-unique-name';
import { CreateTaskStatusDto } from './dto/create-task-status.dto';
import { TaskStatusResponseDto } from './dto/task-status.response-dto';
import { TaskStatusMapper } from '../common/mappers/task-status.mapper';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { BoardResponseDto } from './dto/board.response-dto';
import { generateCopyName } from '../common/utils/generate-copy-name';
import { LocaleDto } from '../common/dto/locale.dto';
import { ColumnColor } from '@prisma/client';
import { throwPrismaError } from '../common/utils/throw-prisma-error';

@Injectable()
export class BoardsService {
  public constructor(private readonly prisma: PrismaService) {}

  public async addBoard(
    createBoardDto: CreateBoardDto,
  ): Promise<BoardResponseDto> {
    try {
      return this.prisma.$transaction(async (prisma) => {
        const existingBoards = await prisma.board.findMany({
          where: {
            projectId: createBoardDto.projectId,
          },
          select: {
            boardName: true,
          },
        });

        if (existingBoards.length >= 5) {
          throw new BadRequestException(
            'You can only add up to 5 boards in the project',
          );
        }

        const baseName = DEFAULT_NAMES[createBoardDto.locale].board;

        const filteredBoards = existingBoards.filter(
          (board) =>
            board.boardName.startsWith(`${baseName} `) ??
            board.boardName === baseName,
        );

        const boardName = generateUniqName(
          filteredBoards,
          (item) => item.boardName,
          baseName,
        );

        const board = await prisma.board.create({
          data: {
            boardName,
            projectId: createBoardDto.projectId,
            columns: {
              create: DEFAULT_NAMES[createBoardDto.locale].defaultColumns,
            },
          },
          include: {
            columns: {
              include: {
                _count: {
                  select: {
                    tasks: true,
                  },
                },
              },
            },
          },
        });
        return BoardMapper.toResponse(board);
      });
    } catch (error) {
      throwPrismaError(error, {
        code: 'P2002',
        exception: ConflictException,
        message: 'Board with this name already exists',
      });
    }
  }

  public async getBoardById(id: string): Promise<BoardResponseDto> {
    try {
      const board = await this.prisma.board.findUniqueOrThrow({
        where: { id },
        include: {
          columns: {
            orderBy: { columnIndex: 'asc' },
            include: {
              _count: {
                select: {
                  tasks: true,
                },
              },
            },
          },
        },
      });

      return BoardMapper.toResponse(board);
    } catch (error) {
      throwPrismaError(error, {
        code: 'P2025',
        exception: NotFoundException,
        message: 'Board not found',
      });
    }
  }

  public async updateBoard(
    id: string,
    updateBoardDto: UpdateBoardDto,
  ): Promise<BoardResponseDto> {
    try {
      const board = await this.prisma.board.update({
        where: { id },
        data: updateBoardDto,
        include: {
          columns: {
            include: {
              _count: {
                select: {
                  tasks: true,
                },
              },
            },
          },
        },
      });

      return BoardMapper.toResponse(board);
    } catch (error) {
      throwPrismaError(error, [
        {
          code: 'P2025',
          exception: NotFoundException,
          message: 'Board not found',
        },
        {
          code: 'P2002',
          exception: ConflictException,
          message: 'Board with this name already exists',
        },
      ]);
    }
  }

  public async deleteBoard(id: string): Promise<void> {
    try {
      await this.prisma.$transaction(async (prisma) => {
        const board = await prisma.board.findUniqueOrThrow({
          where: { id },
          select: {
            projectId: true,
          },
        });

        const boardsCount = await prisma.board.count({
          where: {
            projectId: board.projectId,
          },
        });

        if (boardsCount <= 1) {
          throw new BadRequestException(
            'A project must have at least one board',
          );
        }

        await prisma.board.delete({
          where: { id },
        });
      });
    } catch (error) {
      throwPrismaError(error, {
        code: 'P2025',
        exception: NotFoundException,
        message: 'Board not found',
      });
    }
  }

  public async updateColumnsOrder(
    boardId: string,
    updateColumnsOrderDto: UpdateColumnsOrderDto,
  ): Promise<BoardResponseDto> {
    const board = await this.prisma.board.findUnique({
      where: { id: boardId },
      select: { id: true },
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    const existingColumns = await this.prisma.taskStatus.findMany({
      where: { boardId },
    });
    const existingIdsSet = new Set(existingColumns.map((col) => col.id));

    if (updateColumnsOrderDto.columns.length !== existingIdsSet.size) {
      throw new BadRequestException(
        'Columns list must match existing columns exactly',
      );
    }

    const indices = updateColumnsOrderDto.columns.map((col) => col.columnIndex);
    const unique = new Set(indices);

    if (unique.size !== indices.length) {
      throw new BadRequestException('Indices must not be repeated');
    }

    if (unique.size !== Math.max(...indices)) {
      throw new BadRequestException(
        `Indices must be between 1 and ${unique.size}`,
      );
    }

    for (const col of updateColumnsOrderDto.columns) {
      if (!existingIdsSet.has(col.id)) {
        throw new BadRequestException(
          `Column with id ${col.id} does not belong to the board`,
        );
      }
    }

    await this.prisma.$transaction(
      updateColumnsOrderDto.columns.map((col) =>
        this.prisma.taskStatus.update({
          where: { id: col.id },
          data: { columnIndex: col.columnIndex },
        }),
      ),
    );

    const updatedBoard = await this.prisma.board.findUnique({
      where: { id: boardId },
      include: {
        columns: {
          include: {
            _count: {
              select: {
                tasks: true,
              },
            },
          },
          orderBy: { columnIndex: 'asc' },
        },
      },
    });

    if (!updatedBoard) {
      throw new InternalServerErrorException('Board not found after update');
    }

    return BoardMapper.toResponse(updatedBoard);
  }

  public async duplicateBoard(
    id: string,
    localeDto: LocaleDto,
  ): Promise<BoardResponseDto> {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        const sourceBoard = await prisma.board.findUniqueOrThrow({
          where: { id },
          include: {
            columns: {
              orderBy: {
                columnIndex: 'asc',
              },
              include: {
                tasks: {
                  orderBy: {
                    taskIndex: 'asc',
                  },
                },
              },
            },
          },
        });

        const boards = await prisma.board.findMany({
          where: {
            projectId: sourceBoard.projectId,
          },
          select: {
            boardName: true,
          },
        });

        if (boards.length >= 5) {
          throw new BadRequestException(
            'You can only add up to 5 boards in the project',
          );
        }

        const boardNames = new Set(boards.map((board) => board.boardName));

        const boardName = generateCopyName(
          sourceBoard.boardName,
          localeDto.locale,
          boardNames,
        );

        const newBoard = await prisma.board.create({
          data: {
            boardName,
            projectId: sourceBoard.projectId,

            columns: {
              create: sourceBoard.columns.map((column) => ({
                statusName: column.statusName,
                columnIndex: column.columnIndex,
                color: column.color,

                tasks: {
                  create: column.tasks.map((task) => ({
                    taskName: task.taskName,
                    description: task.description,
                    priority: task.priority,
                    deadline: task.deadline,
                    taskIndex: task.taskIndex,
                  })),
                },
              })),
            },
          },

          include: {
            columns: {
              orderBy: {
                columnIndex: 'asc',
              },
              include: {
                _count: {
                  select: {
                    tasks: true,
                  },
                },
              },
            },
          },
        });

        return BoardMapper.toResponse(newBoard);
      });
    } catch (error) {
      throwPrismaError(error, [
        {
          code: 'P2025',
          exception: NotFoundException,
          message: 'Board not found',
        },
        {
          code: 'P2002',
          exception: ConflictException,
          message: 'Board with this name already exists',
        },
      ]);
    }
  }

  public async addColumn(
    createTaskStatusDto: CreateTaskStatusDto,
  ): Promise<TaskStatusResponseDto> {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        const existingColumns = await prisma.taskStatus.findMany({
          where: {
            boardId: createTaskStatusDto.boardId,
          },
          select: {
            statusName: true,
            color: true,
          },
        });

        if (existingColumns.length >= 5) {
          throw new BadRequestException(
            'You can only add up to 5 columns on the board',
          );
        }

        const baseName = DEFAULT_NAMES[createTaskStatusDto.locale].column;

        const filteredColumns = existingColumns.filter(
          (column) =>
            column.statusName.startsWith(`${baseName} `) ??
            column.statusName === baseName,
        );

        const statusName = generateUniqName(
          filteredColumns,
          (column) => column.statusName,
          baseName,
        );

        const usedColors = new Set(
          existingColumns.map((column) => column.color),
        );

        const availableColors = Object.values(ColumnColor).filter(
          (color) => !usedColors.has(color),
        );

        const color =
          availableColors[Math.floor(Math.random() * availableColors.length)];

        const status = await prisma.taskStatus.create({
          data: {
            boardId: createTaskStatusDto.boardId,
            statusName,
            color,
            columnIndex: existingColumns.length + 1,
          },
          include: {
            _count: {
              select: {
                tasks: true,
              },
            },
          },
        });

        return TaskStatusMapper.toBaseResponse(status);
      });
    } catch (error) {
      throwPrismaError(error, {
        code: 'P2002',
        exception: ConflictException,
        message: 'Column name must be unique on the board',
      });
    }
  }

  public async updateColumn(
    id: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<TaskStatusResponseDto> {
    try {
      const status = await this.prisma.taskStatus.update({
        where: { id },
        data: {
          ...updateTaskStatusDto,
        },
        include: {
          _count: {
            select: {
              tasks: true,
            },
          },
        },
      });

      return TaskStatusMapper.toBaseResponse(status);
    } catch (error) {
      throwPrismaError(error, [
        {
          code: 'P2025',
          exception: NotFoundException,
          message: 'Column not found',
        },
        {
          code: 'P2002',
          exception: ConflictException,
          message: 'Column name must be unique on the board',
        },
      ]);
    }
  }

  public async deleteColumn(id: string): Promise<void> {
    try {
      await this.prisma.$transaction(async (prisma) => {
        const column = await prisma.taskStatus.findUniqueOrThrow({
          where: { id },
          select: {
            columnIndex: true,
            boardId: true,
          },
        });

        const columnsCount = await prisma.taskStatus.count({
          where: {
            boardId: column.boardId,
          },
        });

        if (columnsCount <= 1) {
          throw new BadRequestException(
            'A board must have at least one column',
          );
        }

        await prisma.taskStatus.delete({
          where: { id },
        });

        await prisma.taskStatus.updateMany({
          where: {
            boardId: column.boardId,
            columnIndex: {
              gt: column.columnIndex,
            },
          },
          data: {
            columnIndex: {
              decrement: 1,
            },
          },
        });
      });
    } catch (error) {
      throwPrismaError(error, {
        code: 'P2025',
        exception: NotFoundException,
        message: 'Column not found',
      });
    }
  }
}
