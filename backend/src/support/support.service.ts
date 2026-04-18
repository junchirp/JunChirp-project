import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateSupportDto } from './dto/create-support.dto';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { MessageResponseDto } from '../users/dto/message.response-dto';
import * as sanitizeHtml from 'sanitize-html';

@Injectable()
export class SupportService {
  public constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  public async createSupportRequest(
    createSupportDto: CreateSupportDto,
  ): Promise<MessageResponseDto> {
    const sanitized = sanitizeHtml(createSupportDto.requestHtml, {
      allowedTags: ['p', 'br', 'strong', 'em'],
      allowedAttributes: {},
      disallowedTagsMode: 'discard',
    });

    if (sanitized !== createSupportDto.requestHtml) {
      throw new BadRequestException(
        'Request contains forbidden HTML tags or attributes',
      );
    }

    try {
      const request = await this.prisma.supportRequest.create({
        data: {
          email: createSupportDto.email,
          request: createSupportDto.requestHtml,
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
