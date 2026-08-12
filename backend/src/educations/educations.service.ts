import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { PrismaService } from '../prisma/prisma.service';
import { EducationResponseDto } from './dto/education.response-dto';
import { EducationMapper } from '../common/mappers/education.mapper';
import { throwPrismaError } from '../common/utils/throw-prisma-error';

@Injectable()
export class EducationsService {
  public constructor(private readonly prisma: PrismaService) {}

  public async getInstitutionsAutocomplete(query: string): Promise<string[]> {
    const results = await this.prisma.institution.findMany({
      where: {
        institutionName: {
          contains: query,
          mode: 'insensitive',
        },
      },
      select: {
        institutionName: true,
      },
      take: 10,
    });
    return results.map((institution) => institution.institutionName);
  }

  public async getSpecializationsAutocomplete(
    query: string,
  ): Promise<string[]> {
    const results = await this.prisma.specialization.findMany({
      where: {
        specializationName: {
          contains: query,
          mode: 'insensitive',
        },
      },
      select: {
        specializationName: true,
      },
      take: 10,
    });
    return results.map((specialization) => specialization.specializationName);
  }

  public async getEducations(userId: string): Promise<EducationResponseDto[]> {
    const educations = await this.prisma.education.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'asc',
      },
    });
    return educations.map((edu) => EducationMapper.toResponse(edu));
  }

  public async addEducation(
    userId: string,
    createEducationDto: CreateEducationDto,
  ): Promise<EducationResponseDto> {
    const userEducationsCount = await this.prisma.education.count({
      where: { userId },
    });

    if (userEducationsCount >= 5) {
      throw new BadRequestException('You can only add up to 5 educations.');
    }

    try {
      return await this.prisma.$transaction(async (prisma) => {
        const education = await prisma.education.create({
          data: {
            ...createEducationDto,
            userId,
          },
        });

        await prisma.institution.upsert({
          where: {
            institutionName: createEducationDto.institution,
          },
          update: {},
          create: {
            institutionName: createEducationDto.institution,
          },
        });

        await prisma.specialization.upsert({
          where: {
            specializationName: createEducationDto.specialization,
          },
          update: {},
          create: {
            specializationName: createEducationDto.specialization,
          },
        });

        return EducationMapper.toResponse(education);
      });
    } catch (error) {
      throwPrismaError(error, {
        code: 'P2002',
        exception: ConflictException,
        message: 'Education is already in user list',
      });
    }
  }

  public async updateEducation(
    id: string,
    userId: string,
    updateEducationDto: UpdateEducationDto,
  ): Promise<EducationResponseDto> {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        const education = await prisma.education.update({
          where: {
            id,
            userId,
          },
          data: updateEducationDto,
        });

        await prisma.institution.upsert({
          where: {
            institutionName: updateEducationDto.institution,
          },
          update: {},
          create: {
            institutionName: updateEducationDto.institution,
          },
        });

        await prisma.specialization.upsert({
          where: {
            specializationName: updateEducationDto.specialization,
          },
          update: {},
          create: {
            specializationName: updateEducationDto.specialization,
          },
        });

        return EducationMapper.toResponse(education);
      });
    } catch (error) {
      throwPrismaError(error, [
        {
          code: 'P2025',
          exception: NotFoundException,
          message: 'Education not found',
        },
        {
          code: 'P2002',
          exception: ConflictException,
          message: 'Education is already in user list',
        },
      ]);
    }
  }

  public async deleteEducation(userId: string, id: string): Promise<string> {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        const educationsCount = await prisma.education.count({
          where: { userId },
        });

        if (educationsCount <= 1) {
          throw new BadRequestException(
            'You must have at least one education record',
          );
        }

        await prisma.education.delete({
          where: {
            id,
            userId,
          },
        });

        return id;
      });
    } catch (error) {
      throwPrismaError(error, {
        code: 'P2025',
        exception: NotFoundException,
        message: 'Education not found',
      });
    }
  }
}
