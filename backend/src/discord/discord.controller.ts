import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { User } from '../auth/decorators/user.decorator';
import {
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { DiscordService } from './discord.service';
import { UUIDParam } from '../common/decorators/UUID-param.decorator';

@User('discord')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiForbiddenResponse({
  description:
    'Access denied: email not confirmed / Access denied: discord not confirmed / Access denied: user is not a member of the Discord guild',
})
@Controller('discord')
export class DiscordController {
  public constructor(private readonly discordService: DiscordService) {}

  @ApiOperation({ summary: 'Check user discord connection' })
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Get('me/check')
  // eslint-disable-next-line
  public async checkDiscord(): Promise<void> {}

  @ApiOperation({ summary: 'Check discord channel' })
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Get('projects/:id/channel/check')
  public async checkChannel(@UUIDParam('id') id: string): Promise<void> {
    return this.discordService.checkChannelByProjectId(id);
  }
}
