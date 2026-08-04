import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Role } from '@prisma/client';

@Injectable()
export class RolesService {
  public constructor(private readonly prisma: PrismaService) {}

  public async findOrCreateRole(
    roleName: string,
    prisma: Prisma.TransactionClient = this.prisma,
  ): Promise<Role> {
    return prisma.role.upsert({
      where: { roleName },
      update: {},
      create: { roleName },
    });
  }
}
