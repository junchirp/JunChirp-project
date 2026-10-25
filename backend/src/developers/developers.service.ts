import { Injectable } from '@nestjs/common';
import { DeveloperResponseDto } from './dto/developer.response-dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DevelopersService {
  public constructor(private readonly prisma: PrismaService) {}

  public async getDevelopers(): Promise<DeveloperResponseDto[]> {
    return await this.prisma.developer.findMany();
  }
}
