import {
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  WsException,
} from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { CookieConfigService } from '../cookie-config/cookie-config.service';
import { UsersService } from '../users/users.service';
import { DiscordService } from '../discord/discord.service';
import { PrismaService } from '../prisma/prisma.service';

interface BoardSocketData {
  user: Awaited<ReturnType<UsersService['getUserById']>>;
}

type BoardSocket = Socket<
  Record<string, never>,
  Record<string, never>,
  Record<string, never>,
  BoardSocketData
>;

@WebSocketGateway({
  namespace: '/boards',
  cors: {
    origin: ['http://localhost:3000', 'https://junchirp-ugdf.onrender.com'],
    credentials: true,
  },
})
@Injectable()
export class BoardsGateway implements OnGatewayInit {
  @WebSocketServer()
  private readonly server: Server;

  public constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly cookieConfigService: CookieConfigService,
    private readonly usersService: UsersService,
    private readonly discordService: DiscordService,
    private readonly prisma: PrismaService,
  ) {}

  public afterInit(server: Server): void {
    server.use(async (socket, next) => {
      try {
        const token = this.getAccessToken(socket.handshake.headers.cookie);

        if (!token) {
          return next(new Error('Unauthorized'));
        }

        const payload = await this.jwtService.verifyAsync(token, {
          secret: this.configService.getOrThrow<string>('JWT_SECRET'),
        });
        const user = await this.usersService.getUserById(payload.sub);

        if (!user?.isVerified) {
          return next(new Error('Forbidden'));
        }

        socket.data.user = user;
        next();
      } catch {
        next(new Error('Unauthorized'));
      }
    });
  }

  @SubscribeMessage('board:join')
  public async joinBoard(
    @ConnectedSocket() client: BoardSocket,
    @MessageBody() body: { boardId: string },
  ): Promise<{ event: string; data: { boardId: string } }> {
    const { boardId } = body ?? {};
    const user = client.data.user;

    if (!user || !boardId) {
      throw new WsException('Unauthorized or missing boardId');
    }

    if (!user.discordId) {
      throw new WsException({
        code: 'DISCORD_NOT_CONNECTED',
        message: 'Discord account is not connected',
      });
    }

    const discordUserExists = await this.discordService.userExists(
      user.id,
      user.discordId,
    );

    if (!discordUserExists) {
      throw new WsException({
        code: 'DISCORD_NOT_CONNECTED',
        message: 'Discord account is not connected',
      });
    }

    const isGuildMember = await this.discordService.isGuildMember(
      user.discordId,
    );

    if (!isGuildMember) {
      throw new WsException({
        code: 'DISCORD_NOT_IN_GUILD',
        message: 'User is not a member of the Discord guild',
      });
    }

    const board = await this.prisma.board.findFirst({
      where: {
        id: boardId,
        project: {
          OR: [
            { ownerId: user.id },
            {
              roles: {
                some: {
                  users: {
                    some: { id: user.id },
                  },
                },
              },
            },
          ],
        },
      },
      select: { id: true },
    });

    if (!board) {
      throw new WsException('Board not found or access denied');
    }

    await client.join(this.getBoardRoom(boardId));

    return {
      event: 'board:joined',
      data: { boardId },
    };
  }

  @SubscribeMessage('board:leave')
  public async leaveBoard(
    @ConnectedSocket() client: BoardSocket,
    @MessageBody() body: { boardId: string },
  ): Promise<{ event: string; data: { boardId: string } }> {
    const { boardId } = body ?? {};

    if (!boardId) {
      throw new WsException('Missing boardId');
    }

    await client.leave(this.getBoardRoom(boardId));

    return {
      event: 'board:left',
      data: { boardId },
    };
  }

  public notifyBoardUpdated(
    boardId: string,
    payload: { type: string; boardId: string; projectId?: string },
  ): void {
    this.server.to(this.getBoardRoom(boardId)).emit('board:updated', payload);
  }

  public notifyTasksUpdated(
    boardId: string,
    payload: {
      type: string;
      taskId: string;
      oldColumnId?: string;
      newColumnId?: string;
      columnId?: string;
    },
  ): void {
    this.server.to(this.getBoardRoom(boardId)).emit('tasks:updated', payload);
  }

  private getBoardRoom(boardId: string): string {
    return `board:${boardId}`;
  }

  private getAccessToken(cookieHeader?: string): string | undefined {
    if (!cookieHeader) {
      return undefined;
    }

    const cookieName = this.cookieConfigService.accessTokenCookieName;
    const cookie = cookieHeader
      .split(';')
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${cookieName}=`));

    if (!cookie) {
      return undefined;
    }

    const value = cookie.slice(cookieName.length + 1);

    try {
      return decodeURIComponent(value);
    } catch {
      return undefined;
    }
  }
}
