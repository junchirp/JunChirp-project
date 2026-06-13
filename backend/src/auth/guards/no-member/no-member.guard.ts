import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class NoMemberGuard implements CanActivate {
  public constructor(private prisma: PrismaService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const projectId = request.params?.id;

    if (!projectId) {
      throw new BadRequestException('Missing project id');
    }

    const isParticipant = await this.prisma.project.findFirst({
      where: {
        id: projectId,
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
      select: { id: true },
    });

    if (isParticipant) {
      throw new ForbiddenException({
        message: 'Access denied: members must use dashboard',
        code: 'GUARD_ERROR',
      });
    }

    return true;
  }
}
