import { Controller, Get } from '@nestjs/common';
import { DevelopersService } from './developers.service';
import { DeveloperResponseDto } from './dto/developer.response-dto';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller('developers')
export class DevelopersController {
  public constructor(private readonly developersService: DevelopersService) {}

  @ApiOperation({ summary: 'Get developers list' })
  @ApiOkResponse({ type: [DeveloperResponseDto] })
  @Get('')
  public async getDevelopers(): Promise<DeveloperResponseDto[]> {
    return this.developersService.getDevelopers();
  }
}
