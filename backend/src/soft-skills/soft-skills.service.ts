import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSoftSkillDto } from './dto/create-soft-skill.dto';
import { UpdateSoftSkillDto } from './dto/update-soft-skill.dto';
import { SoftSkillResponseDto } from './dto/soft-skill.response-dto';
import { PrismaService } from '../prisma/prisma.service';
import { SoftSkillMapper } from '../common/mappers/soft-skill.mapper';
import { throwPrismaError } from '../common/utils/throw-prisma-error';

@Injectable()
export class SoftSkillsService {
  public constructor(private readonly prisma: PrismaService) {}

  public async getSoftSkillsAutocomplete(query: string): Promise<string[]> {
    const results = await this.prisma.softSkill.findMany({
      where: {
        softSkillName: {
          contains: query,
          mode: 'insensitive',
        },
      },
      select: {
        softSkillName: true,
      },
      take: 10,
    });

    return results.map((skill) => skill.softSkillName);
  }

  public async getSoftSkills(userId: string): Promise<SoftSkillResponseDto[]> {
    const skills = await this.prisma.userSoftSkill.findMany({
      where: { userId },
    });
    return skills.map((skill) => SoftSkillMapper.toResponse(skill));
  }

  public async addSoftSkill(
    userId: string,
    createSoftSkillDto: CreateSoftSkillDto,
  ): Promise<SoftSkillResponseDto> {
    const userSoftSkillsCount = await this.prisma.userSoftSkill.count({
      where: { userId },
    });

    if (userSoftSkillsCount >= 20) {
      throw new BadRequestException('You can only add up to 20 soft skills');
    }

    try {
      return await this.prisma.$transaction(async (prisma) => {
        const softSkill = await prisma.userSoftSkill.create({
          data: {
            ...createSoftSkillDto,
            userId,
          },
        });

        await prisma.softSkill.upsert({
          where: {
            softSkillName: createSoftSkillDto.softSkillName,
          },
          update: {},
          create: {
            softSkillName: createSoftSkillDto.softSkillName,
          },
        });

        return SoftSkillMapper.toResponse(softSkill);
      });
    } catch (error) {
      throwPrismaError(error, {
        code: 'P2002',
        exception: ConflictException,
        message: 'Soft skill is already in user list',
      });
    }
  }

  public async updateSoftSkill(
    id: string,
    userId: string,
    updateSoftSkillDto: UpdateSoftSkillDto,
  ): Promise<SoftSkillResponseDto> {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        const { count } = await prisma.userSoftSkill.updateMany({
          where: {
            id,
            userId,
          },
          data: updateSoftSkillDto,
        });

        if (count === 0) {
          throw new NotFoundException('Soft skill not found');
        }

        await prisma.softSkill.upsert({
          where: {
            softSkillName: updateSoftSkillDto.softSkillName,
          },
          update: {},
          create: {
            softSkillName: updateSoftSkillDto.softSkillName,
          },
        });

        const softSkill = await prisma.userSoftSkill.findUniqueOrThrow({
          where: { id },
        });

        return SoftSkillMapper.toResponse(softSkill);
      });
    } catch (error) {
      throwPrismaError(error, [
        {
          code: 'P2025',
          exception: NotFoundException,
          message: 'Soft skill not found',
        },
        {
          code: 'P2002',
          exception: ConflictException,
          message: 'Soft skill is already in user list',
        },
      ]);
    }
  }

  public async deleteSoftSkill(userId: string, id: string): Promise<string> {
    return this.prisma.$transaction(async (prisma) => {
      const userSoftSkillsCount = await prisma.userSoftSkill.count({
        where: { userId },
      });

      if (userSoftSkillsCount <= 1) {
        throw new BadRequestException('You must have at least one soft skill');
      }

      const { count } = await prisma.userSoftSkill.deleteMany({
        where: {
          id,
          userId,
        },
      });

      if (count === 0) {
        throw new NotFoundException('Soft skill not found');
      }

      return id;
    });
  }
}
