import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ParticipationsService } from './participations.service';
import { CreateInviteDto } from './dto/create-invite.dto';
import { Owner } from '../auth/decorators/owner.decorator';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ProjectParticipationResponseDto } from './dto/project-participation.response-dto';
import { User } from '../auth/decorators/user.decorator';
import { CreateRequestDto } from './dto/create-request.dto';
import { UUIDParam } from '../common/decorators/UUID-param.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserParticipationResponseDto } from './dto/user-participation.response-dto';
import { ParseUUIDv4Pipe } from '../common/pipes/parse-UUIDv4/parse-UUIDv4.pipe';
import { Member } from '../auth/decorators/member.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';
import { InvitesListResponseDto } from './dto/invites-list.response-dto';
import { RequestsListResponseDto } from './dto/requests-list.response-dto';

@User()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('participations')
export class ParticipationsController {
  public constructor(
    private readonly participationsService: ParticipationsService,
  ) {}

  @Owner('body', 'projectId', 'project')
  @ApiOperation({ summary: 'Create invite (owner)' })
  @ApiCreatedResponse({ type: ProjectParticipationResponseDto })
  @ApiNotFoundResponse({ description: 'User or project role not found' })
  @ApiConflictResponse({
    description:
      'User is already in the project team / User has already been invited to this project / User has already requested participation in this project',
  })
  @ApiForbiddenResponse({
    description:
      'Access denied: you are not the project owner / Access denied: email not confirmed / Access denied: discord not confirmed / Invalid CSRF token',
  })
  @ApiBadRequestResponse({
    description:
      'User cannot have more than 2 active projects / The role has no empty slots / Invalid project/role combination',
  })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @Post('invites')
  public async createInvite(
    @Body() createInviteDto: CreateInviteDto,
  ): Promise<ProjectParticipationResponseDto> {
    return this.participationsService.createInvite(createInviteDto);
  }

  @User('discord')
  @ApiOperation({ summary: 'Create request (user)' })
  @ApiCreatedResponse({ type: ProjectParticipationResponseDto })
  @ApiNotFoundResponse({ description: 'Project role not found' })
  @ApiConflictResponse({
    description:
      'You are already in the project team / You have already been invited to this project / You have already sent a request to this project',
  })
  @ApiForbiddenResponse({
    description:
      'Access denied: email not confirmed / Access denied: discord not confirmed / Invalid CSRF token',
  })
  @ApiBadRequestResponse({
    description:
      'User cannot have more than 2 active projects / The role has no empty slots / Invalid project/role combination',
  })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @Post('requests')
  public async createRequest(
    @Body() createRequestDto: CreateRequestDto,
    @CurrentUser('id') userId: string,
  ): Promise<ProjectParticipationResponseDto> {
    return this.participationsService.createRequest(createRequestDto, userId);
  }

  @User('discord')
  @ApiOperation({ summary: 'Accept invite (user)' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'Invite not found' })
  @ApiConflictResponse({ description: 'The role has no empty slots' })
  @ApiForbiddenResponse({
    description:
      'Access denied: email not confirmed / Access denied: discord not confirmed / Invalid CSRF token',
  })
  @ApiBadRequestResponse({
    description: 'User cannot have more than 2 active projects',
  })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('invites/:id/accept')
  public async acceptInvite(
    @CurrentUser('id') userId: string,
    @UUIDParam('id') id: string,
  ): Promise<void> {
    return this.participationsService.acceptInvite(id, userId);
  }

  @ApiOperation({ summary: 'Reject invite (user)' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'Invite not found' })
  @ApiForbiddenResponse({
    description: 'Access denied: email not confirmed / Invalid CSRF token',
  })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('invites/:id/reject')
  public async rejectInvite(
    @CurrentUser('id') userId: string,
    @UUIDParam('id') id: string,
  ): Promise<void> {
    return this.participationsService.rejectInvite(id, userId);
  }

  @Owner('params', 'id', 'participationRequest')
  @ApiOperation({ summary: 'Accept request (owner)' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'Request not found' })
  @ApiConflictResponse({ description: 'The role has no empty slots' })
  @ApiForbiddenResponse({
    description:
      'Access denied: you are not the project owner / Access denied: email not confirmed / Access denied: discord not confirmed / Invalid CSRF token',
  })
  @ApiBadRequestResponse({
    description: 'User cannot have more than 2 active projects',
  })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('requests/:id/accept')
  public async acceptRequest(@UUIDParam('id') id: string): Promise<void> {
    return this.participationsService.acceptRequest(id);
  }

  @Owner('params', 'id', 'participationRequest')
  @ApiOperation({ summary: 'Reject request (owner)' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'Request not found' })
  @ApiForbiddenResponse({
    description:
      'Access denied: you are not the project owner / Access denied: email not confirmed / Access denied: discord not confirmed / Invalid CSRF token',
  })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('requests/:id/reject')
  public async rejectRequest(@UUIDParam('id') id: string): Promise<void> {
    return this.participationsService.rejectRequest(id);
  }

  @ApiOperation({ summary: 'Cancel request (user)' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'Request not found' })
  @ApiForbiddenResponse({
    description:
      'Access denied: email not confirmed / Access denied: discord not confirmed / Invalid CSRF token',
  })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('requests/:id/cancel')
  public async cancelRequest(
    @CurrentUser('id') userId: string,
    @UUIDParam('id') id: string,
  ): Promise<void> {
    return this.participationsService.cancelRequest(id, userId);
  }

  @Owner('params', 'id', 'participationInvite')
  @ApiOperation({ summary: 'Cancel invite (owner)' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'Invite not found' })
  @ApiForbiddenResponse({
    description:
      'Access denied: you are not the project owner / Access denied: email not confirmed / Access denied: discord not confirmed / Invalid CSRF token',
  })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('invites/:id/cancel')
  public async cancelInvite(@UUIDParam('id') id: string): Promise<void> {
    return this.participationsService.cancelInvite(id);
  }

  @Owner()
  @ApiOperation({
    summary: 'Get current project invites',
  })
  @ApiOkResponse({ type: [UserParticipationResponseDto] })
  @ApiForbiddenResponse({
    description:
      'Access denied: you are not a participant of this project / Access denied: email not confirmed / Access denied: discord not confirmed',
  })
  @Get('projects/:id/invites')
  public async getInvitesInCurrentProject(
    @Param('id', ParseUUIDv4Pipe) id: string,
  ): Promise<UserParticipationResponseDto[]> {
    return this.participationsService.getInvitesWithUsers(id);
  }

  @Owner()
  @ApiOperation({
    summary: 'Get current project requests',
  })
  @ApiOkResponse({ type: [UserParticipationResponseDto] })
  @ApiForbiddenResponse({
    description:
      'Access denied: you are not a participant of this project / Access denied: email not confirmed / Access denied: discord not confirmed',
  })
  @Get('projects/:id/requests')
  public async getRequestsInCurrentProject(
    @Param('id', ParseUUIDv4Pipe) id: string,
  ): Promise<UserParticipationResponseDto[]> {
    return this.participationsService.getRequestsWithUsers(id);
  }

  @Member()
  @ApiOperation({ summary: 'User leaves project' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'User is not in the team' })
  @ApiForbiddenResponse({
    description:
      'Access denied: you are not a participant of this project / Access denied: email not confirmed / Access denied: discord not confirmed / Invalid CSRF token',
  })
  @ApiBadRequestResponse({
    description: 'User is no longer part of this project',
  })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('projects/:id/leave')
  public async leaveProject(
    @UUIDParam('id') id: string,
    @CurrentUser('id') userId: string,
  ): Promise<void> {
    return this.participationsService.handleUserRemovalFromProject(id, userId);
  }

  @Owner()
  @ApiOperation({ summary: 'Remove user from project team' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'User is not in the team' })
  @ApiForbiddenResponse({
    description:
      'Access denied: you are not the project owner / Access denied: email not confirmed / Access denied: discord not confirmed / Invalid CSRF token',
  })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('projects/:id/users/:userId')
  public async removeUserFromProject(
    @UUIDParam('id') id: string,
    @UUIDParam('userId') userId: string,
  ): Promise<void> {
    return this.participationsService.handleUserRemovalFromProject(id, userId);
  }

  @ApiOperation({
    summary: 'Get current user invites',
  })
  @ApiOkResponse({ type: InvitesListResponseDto })
  @ApiForbiddenResponse({ description: 'Access denied: email not confirmed' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('me/invites')
  public async getInvitesMe(
    @Query() query: PaginationDto,
    @CurrentUser('id') id: string,
  ): Promise<InvitesListResponseDto> {
    return this.participationsService.getInvitesWithProjects(query, id);
  }

  @ApiOperation({
    summary: 'Get current user requests',
  })
  @ApiOkResponse({ type: RequestsListResponseDto })
  @ApiForbiddenResponse({ description: 'Access denied: email not confirmed' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('me/requests')
  public async getRequestsMe(
    @Query() query: PaginationDto,
    @CurrentUser('id') id: string,
  ): Promise<RequestsListResponseDto> {
    return this.participationsService.getRequestsWithProjects(query, id);
  }

  @ApiOperation({
    summary: `Get requests by user id in current user's projects`,
  })
  @ApiOkResponse({ type: RequestsListResponseDto })
  @ApiForbiddenResponse({ description: 'Access denied: email not confirmed' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('users/:id/requests')
  public async getRequestsByUserId(
    @Query() query: PaginationDto,
    @UUIDParam('id') id: string,
    @CurrentUser('id') ownerId: string,
  ): Promise<RequestsListResponseDto> {
    return this.participationsService.getRequestsWithProjects(
      query,
      id,
      ownerId,
    );
  }

  @ApiOperation({
    summary: `Get invites by user id in current user's projects`,
  })
  @ApiOkResponse({ type: InvitesListResponseDto })
  @ApiForbiddenResponse({ description: 'Access denied: email not confirmed' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('users/:id/invites')
  public async getInvitesByUserId(
    @Query() query: PaginationDto,
    @UUIDParam('id') id: string,
    @CurrentUser('id') ownerId: string,
  ): Promise<InvitesListResponseDto> {
    return this.participationsService.getInvitesWithProjects(
      query,
      id,
      ownerId,
    );
  }
}
