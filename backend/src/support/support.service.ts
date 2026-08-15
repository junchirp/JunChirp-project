import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateSupportDto } from './dto/create-support.dto';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { MessageResponseDto } from '../users/dto/message.response-dto';

@Injectable()
export class SupportService {
  public constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  public async createSupportRequest(
    createSupportDto: CreateSupportDto,
  ): Promise<MessageResponseDto> {
    try {
      const request = await this.prisma.supportRequest.create({
        data: {
          email: createSupportDto.email,
          request: createSupportDto.request,
        },
      });

      await this.mailService.sendSupportRequest(
        request,
        createSupportDto.locale,
      );

      return {
        message: 'Support request created successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
