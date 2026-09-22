import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  public constructor(configService: ConfigService) {
    const connectionString = configService.getOrThrow<string>('DATABASE_URL');
    const adapter = new PrismaPg({ connectionString });
    super({ adapter });
  }

  public async onModuleInit(): Promise<void> {
    console.log('Prisma: before $connect');
    await this.$connect();
    console.log('Prisma: after $connect');
  }

  public async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
