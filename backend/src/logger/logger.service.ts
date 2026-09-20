import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LogEventType } from '@prisma/client';
import { InputJsonValue } from '@prisma/client/runtime/client';

@Injectable()
export class LoggerService {
  public constructor(private readonly prisma: PrismaService) {}

  public async log(
    eventType: LogEventType,
    description: string,
    options?: {
      ip?: string;
      email?: string;
      metadata?: InputJsonValue;
    },
  ): Promise<void> {
    await this.prisma.logEvent.create({
      data: {
        eventType,
        description,
        ip: options?.ip,
        email: options?.email,
        metadata: options?.metadata,
      },
    });
  }
}
