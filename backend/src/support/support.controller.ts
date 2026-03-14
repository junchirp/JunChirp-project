import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { SupportService } from './support.service';
import { CreateSupportDto } from './dto/create-support.dto';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { MessageResponseDto } from '../users/dto/message.response-dto';

@Controller('support')
export class SupportController {
  public constructor(private supportService: SupportService) {}

  @ApiOperation({ summary: 'Create support request' })
  @ApiOkResponse({ type: MessageResponseDto })
  @ApiForbiddenResponse({ description: 'Invalid CSRF token' })
  @ApiBadRequestResponse({
    description: 'Request contains forbidden HTML tags or attributes',
  })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @HttpCode(HttpStatus.OK)
  @Post('')
  public async updateTaskStatus(
    @Body() createSupportDto: CreateSupportDto,
  ): Promise<MessageResponseDto> {
    return this.supportService.createSupportRequest(createSupportDto);
  }
}
