import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSocialDto } from './dto/create-social.dto';
import { UpdateSocialDto } from './dto/update-social.dto';
import { SocialResponseDto } from './dto/social.response-dto';
import { PrismaService } from '../prisma/prisma.service';
import { SocialMapper } from '../common/mappers/social.mapper';
import { throwPrismaError } from '../common/utils/throw-prisma-error';

@Injectable()
export class SocialsService {
  public constructor(private readonly prisma: PrismaService) {}

  public async getSocialNetworks(userId: string): Promise<SocialResponseDto[]> {
    const skills = await this.prisma.social.findMany({ where: { userId } });
    return skills.map((social) => SocialMapper.toResponse(social));
  }

  public async addSocialNetwork(
    userId: string,
    createSocialDto: CreateSocialDto,
  ): Promise<SocialResponseDto> {
    const userProfilesCount = await this.prisma.social.count({
      where: { userId },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (userProfilesCount >= 5) {
      throw new BadRequestException(
        'You can only add up to 5 social networks.',
      );
    }

    try {
      const social = await this.prisma.social.create({
        data: { ...createSocialDto, userId },
      });

      return SocialMapper.toResponse(social);
    } catch (error) {
      throwPrismaError(error, {
        code: 'P2002',
        exception: ConflictException,
        message: 'You have already added a profile in this social network',
      });
    }
  }

  public async updateSocialNetwork(
    id: string,
    userId: string,
    updateSocialDto: UpdateSocialDto,
  ): Promise<SocialResponseDto> {
    try {
      const social = await this.prisma.social.update({
        where: {
          id,
          userId,
        },
        data: updateSocialDto,
      });
      return SocialMapper.toResponse(social);
    } catch (error) {
      throwPrismaError(error, [
        {
          code: 'P2025',
          exception: NotFoundException,
          message: 'Social profile not found',
        },
        {
          code: 'P2002',
          exception: ConflictException,
          message: 'Profile with this network already exists',
        },
      ]);
    }
  }

  public async deleteSocialNetwork(
    userId: string,
    id: string,
  ): Promise<string> {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        const social = await prisma.social.count({
          where: { userId },
        });

        if (social <= 1) {
          throw new BadRequestException(
            'You must have at least one social profile',
          );
        }

        await prisma.social.delete({
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
        message: 'Social profile not found',
      });
    }
  }
}
