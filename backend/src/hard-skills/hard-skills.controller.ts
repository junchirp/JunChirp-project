import {
  Controller,
  Post,
  Body,
  Delete,
  Req,
  Put,
  Get,
  Query,
} from '@nestjs/common';
import { HardSkillsService } from './hard-skills.service';
import { CreateHardSkillDto } from './dto/create-hard-skill.dto';
import { UpdateHardSkillDto } from './dto/update-hard-skill.dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { UserWithPasswordResponseDto } from '../users/dto/user-with-password.response-dto';
import { HardSkillResponseDto } from './dto/hard-skill.response-dto';
import { User } from '../auth/decorators/user.decorator';
import { UUIDParam } from 'src/shared/decorators/UUID-param.decorator';

@User()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('hard-skills')
export class HardSkillsController {
  public constructor(private hardSkillsService: HardSkillsService) {}

  @ApiOperation({ summary: 'Get list of hard skills names' })
  @ApiOkResponse({ type: [String] })
  @ApiForbiddenResponse({
    description: 'Access denied: email not confirmed',
  })
  @Get('list')
  public async getSkillsAutocomplete(
    @Query('skill') query: string,
  ): Promise<string[]> {
    return this.hardSkillsService.getHardSkillsAutocomplete(query);
  }

  @ApiOperation({ summary: `Get list of the current user's hard skills` })
  @ApiOkResponse({ type: [HardSkillResponseDto] })
  @ApiForbiddenResponse({
    description: 'Access denied: email not confirmed',
  })
  @Get('')
  public async getHardSkills(
    @Req() req: Request,
  ): Promise<HardSkillResponseDto[]> {
    const user: UserWithPasswordResponseDto =
      req.user as UserWithPasswordResponseDto;
    return this.hardSkillsService.getHardSkills(user.id);
  }

  @ApiOperation({ summary: 'Add hard skill' })
  @ApiCreatedResponse({ type: HardSkillResponseDto })
  @ApiBadRequestResponse({
    description: 'You can only add up to 20 hard skills',
  })
  @ApiForbiddenResponse({
    description: 'Access denied: email not confirmed / Invalid CSRF token',
  })
  @ApiConflictResponse({ description: 'Hard skill is already in list' })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @Post('')
  public async addHardSkill(
    @Req() req: Request,
    @Body() createHardSkillDto: CreateHardSkillDto,
  ): Promise<HardSkillResponseDto> {
    const user: UserWithPasswordResponseDto =
      req.user as UserWithPasswordResponseDto;
    return this.hardSkillsService.addHardSkill(user.id, createHardSkillDto);
  }

  @ApiOperation({ summary: 'Update hard skill' })
  @ApiOkResponse({ type: HardSkillResponseDto })
  @ApiNotFoundResponse({ description: 'Hard skill not found' })
  @ApiForbiddenResponse({
    description: 'Access denied: email not confirmed / Invalid CSRF token',
  })
  @ApiConflictResponse({ description: 'Hard skill is already in list' })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @Put(':id')
  public async updateHardSkill(
    @UUIDParam('id') id: string,
    @Body() updateHardSkillDto: UpdateHardSkillDto,
  ): Promise<HardSkillResponseDto> {
    return this.hardSkillsService.updateHardSkill(id, updateHardSkillDto);
  }

  @ApiOperation({ summary: 'Delete hard skill' })
  @ApiOkResponse({ type: String })
  @ApiNotFoundResponse({ description: 'Hard skill not found' })
  @ApiForbiddenResponse({
    description: 'Access denied: email not confirmed / Invalid CSRF token',
  })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @Delete(':id')
  public async deleteHardSkill(@UUIDParam('id') id: string): Promise<string> {
    return this.hardSkillsService.deleteHardSkill(id);
  }
}
