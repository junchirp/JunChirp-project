import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateHardSkillDto } from './dto/create-hard-skill.dto';
import { UpdateHardSkillDto } from './dto/update-hard-skill.dto';
import { HardSkillResponseDto } from './dto/hard-skill.response-dto';
import { PrismaService } from '../prisma/prisma.service';
import { HardSkillMapper } from '../common/mappers/hard-skill.mapper';
import { throwPrismaError } from '../common/utils/throw-prisma-error';

@Injectable()
export class HardSkillsService {
  public constructor(private readonly prisma: PrismaService) {}

  public async getHardSkillsAutocomplete(query: string): Promise<string[]> {
    const results = await this.prisma.hardSkill.findMany({
      where: {
        hardSkillName: {
          contains: query,
          mode: 'insensitive',
        },
      },
      select: {
        hardSkillName: true,
      },
      take: 10,
    });
    return results.map((skill) => skill.hardSkillName);
  }

  public async getHardSkills(userId: string): Promise<HardSkillResponseDto[]> {
    const skills = await this.prisma.userHardSkill.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'asc',
      },
    });
    return skills.map((skill) => HardSkillMapper.toResponse(skill));
  }

  public async addHardSkill(
    userId: string,
    createHardSkillDto: CreateHardSkillDto,
  ): Promise<HardSkillResponseDto> {
    const userHardSkillsCount = await this.prisma.userHardSkill.count({
      where: { userId },
    });

    if (userHardSkillsCount >= 20) {
      throw new BadRequestException('You can only add up to 20 hard skills');
    }

    try {
      return await this.prisma.$transaction(async (prisma) => {
        const hardSkill = await prisma.userHardSkill.create({
          data: {
            ...createHardSkillDto,
            userId,
          },
        });

        await prisma.hardSkill.upsert({
          where: {
            hardSkillName: createHardSkillDto.hardSkillName,
          },
          update: {},
          create: {
            hardSkillName: createHardSkillDto.hardSkillName,
          },
        });

        return HardSkillMapper.toResponse(hardSkill);
      });
    } catch (error) {
      throwPrismaError(error, {
        code: 'P2002',
        exception: ConflictException,
        message: 'Hard skill is already in user list',
      });
    }
  }

  public async updateHardSkill(
    id: string,
    userId: string,
    updateHardSkillDto: UpdateHardSkillDto,
  ): Promise<HardSkillResponseDto> {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        const { count } = await prisma.userHardSkill.updateMany({
          where: {
            id,
            userId,
          },
          data: updateHardSkillDto,
        });

        if (count === 0) {
          throw new NotFoundException('Hard skill not found');
        }

        await prisma.hardSkill.upsert({
          where: {
            hardSkillName: updateHardSkillDto.hardSkillName,
          },
          update: {},
          create: {
            hardSkillName: updateHardSkillDto.hardSkillName,
          },
        });

        const hardSkill = await prisma.userHardSkill.findUniqueOrThrow({
          where: { id },
        });

        return HardSkillMapper.toResponse(hardSkill);
      });
    } catch (error) {
      throwPrismaError(error, [
        {
          code: 'P2025',
          exception: NotFoundException,
          message: 'Hard skill not found',
        },
        {
          code: 'P2002',
          exception: ConflictException,
          message: 'Hard skill is already in user list',
        },
      ]);
    }
  }

  public async deleteHardSkill(userId: string, id: string): Promise<string> {
    return this.prisma.$transaction(async (prisma) => {
      const userHardSkillsCount = await prisma.userHardSkill.count({
        where: { userId },
      });

      if (userHardSkillsCount <= 1) {
        throw new BadRequestException('You must have at least one hard skill');
      }

      const { count } = await prisma.userHardSkill.deleteMany({
        where: {
          id,
          userId,
        },
      });

      if (count === 0) {
        throw new NotFoundException('Hard skill not found');
      }

      return id;
    });
  }
}
