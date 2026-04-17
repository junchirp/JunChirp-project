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
import { EducationMapper } from '../shared/mappers/education.mapper';

@Injectable()
export class EducationsService {
  public constructor(private prisma: PrismaService) {}

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

    return this.prisma.$transaction(async (prisma) => {
      try {
        const education = await prisma.education.create({
          data: {
            ...createEducationDto,
            userId,
          },
        });

        const recordInstitution = await prisma.institution.findFirst({
          where: {
            institutionName: createEducationDto.institution,
          },
        });

        if (!recordInstitution) {
          await prisma.institution.create({
            data: {
              institutionName: createEducationDto.institution,
            },
          });
        }

        const recordSpecialization = await prisma.specialization.findFirst({
          where: {
            specializationName: createEducationDto.specialization,
          },
        });

        if (!recordSpecialization) {
          await prisma.specialization.create({
            data: {
              specializationName: createEducationDto.specialization,
            },
          });
        }

        return EducationMapper.toResponse(education);
      } catch (error) {
        if (error.code === 'P2002') {
          throw new ConflictException('Education is already in list');
        }
        throw error;
      }
    });
  }

  public async updateEducation(
    id: string,
    updateEducationDto: UpdateEducationDto,
  ): Promise<EducationResponseDto> {
    return this.prisma.$transaction(async (prisma) => {
      try {
        const recordInstitution = await prisma.institution.findFirst({
          where: {
            institutionName: updateEducationDto.institution,
          },
        });

        if (!recordInstitution) {
          await prisma.institution.create({
            data: {
              institutionName: updateEducationDto.institution,
            },
          });
        }

        const recordSpecialization = await prisma.specialization.findFirst({
          where: {
            specializationName: updateEducationDto.specialization,
          },
        });

        if (!recordSpecialization) {
          await prisma.specialization.create({
            data: {
              specializationName: updateEducationDto.specialization,
            },
          });
        }

        const education = await prisma.education.update({
          where: { id },
          data: {
            ...updateEducationDto,
          },
        });

        return EducationMapper.toResponse(education);
      } catch (error) {
        switch (error.code) {
          case 'P2025':
            throw new NotFoundException('Education not found');
          case 'P2002':
            throw new ConflictException('Education is already in list');
          default:
            throw error;
        }
      }
    });
  }

  public async deleteEducation(id: string): Promise<string> {
    try {
      await this.prisma.education.delete({
        where: { id },
      });
      return id;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Education not found');
      }
      throw error;
    }
  }
}
