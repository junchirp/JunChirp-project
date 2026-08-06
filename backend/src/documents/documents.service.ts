import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { DocumentResponseDto } from './dto/document.response-dto';
import { PrismaService } from '../prisma/prisma.service';
import { DocumentMapper } from '../common/mappers/document.mapper';
import { throwPrismaError } from '../common/utils/throw-prisma-error';

@Injectable()
export class DocumentsService {
  public constructor(private readonly prisma: PrismaService) {}

  public async addDocument(
    createDocumentDto: CreateDocumentDto,
  ): Promise<DocumentResponseDto> {
    const documentCount = await this.prisma.document.count({
      where: {
        projectId: createDocumentDto.projectId,
      },
    });

    if (documentCount >= 20) {
      throw new BadRequestException(
        'Maximum number of documents per project is 20',
      );
    }

    try {
      const document = await this.prisma.document.create({
        data: createDocumentDto,
      });

      return DocumentMapper.toResponse(document);
    } catch (error) {
      throwPrismaError(error, {
        code: 'P2002',
        exception: ConflictException,
        message: 'Duplicate document url',
      });
    }
  }

  public async updateDocument(
    id: string,
    updateDocumentDto: UpdateDocumentDto,
  ): Promise<DocumentResponseDto> {
    try {
      const document = await this.prisma.document.update({
        where: { id },
        data: updateDocumentDto,
      });

      return DocumentMapper.toResponse(document);
    } catch (error) {
      throwPrismaError(error, [
        {
          code: 'P2025',
          exception: NotFoundException,
          message: 'Document not found',
        },
        {
          code: 'P2002',
          exception: ConflictException,
          message: 'Duplicate document url',
        },
      ]);
    }
  }

  public async deleteDocument(id: string): Promise<void> {
    try {
      await this.prisma.document.delete({
        where: { id },
      });
    } catch (error) {
      throwPrismaError(error, {
        code: 'P2025',
        exception: NotFoundException,
        message: 'Document not found',
      });
    }
  }
}
