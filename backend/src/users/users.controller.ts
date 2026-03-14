import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  Patch,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Auth } from '../auth/decorators/auth.decorator';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { MessageResponseDto } from './dto/message.response-dto';
import { EmailWithLocaleDto } from './dto/email-with-locale.dto';
import { UserResponseDto } from './dto/user.response-dto';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { Request, Response } from 'express';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ProjectsListResponseDto } from '../projects/dto/projects-list.response-dto';
import { UserProjectsFilterDto } from './dto/user-projects-filter.dto';
import { UsersListResponseDto } from './dto/users-list.response-dto';
import { UsersFilterDto } from './dto/users-filter.dto';
import { ProjectParticipationResponseDto } from '../participations/dto/project-participation.response-dto';
import { User } from '../auth/decorators/user.decorator';
import { EmailValidationResponseDto } from './dto/email-validation.response-dto';
import { TokenValidationResponseDto } from './dto/token-validation.response-dto';
import { AuthResponseDto } from './dto/auth.response-dto';
import { EmailResponseDto } from './dto/email.response-dto';
import { UUIDParam } from '../shared/decorators/UUID-param.decorator';
import { LocaleDto } from '../shared/dto/locale.dto';
import { ConfirmEmailWithLocaleDto } from './dto/confirm-email-with-locale.dto';
import { CurrentUser } from '../shared/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  public constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Resend confirmation email' })
  @ApiOkResponse({ type: MessageResponseDto })
  @ApiTooManyRequestsResponse({
    description: 'You have used up all your attempts. Please try again later.',
  })
  @ApiForbiddenResponse({ description: 'Invalid CSRF token' })
  @ApiBadRequestResponse({ description: 'Email is confirmed' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @HttpCode(HttpStatus.OK)
  @Post('send-confirmation-email/resend')
  public async resendConfirmationEmail(
    @Ip() ip: string,
    @Body() confirmEmailWithLocale: ConfirmEmailWithLocaleDto,
  ): Promise<MessageResponseDto> {
    return this.usersService.resendConfirmationEmail(
      ip,
      confirmEmailWithLocale,
    );
  }

  @Auth()
  @ApiOperation({ summary: 'Send confirmation email' })
  @ApiOkResponse({ type: MessageResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiTooManyRequestsResponse({
    description: 'You have used up all your attempts. Please try again later.',
  })
  @ApiForbiddenResponse({ description: 'Invalid CSRF token' })
  @ApiBadRequestResponse({ description: 'Email is confirmed' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @HttpCode(HttpStatus.OK)
  @Post('send-confirmation-email')
  public async sendConfirmationEmail(
    @Ip() ip: string,
    @Body() localeDto: LocaleDto,
    @CurrentUser() user: AuthResponseDto,
  ): Promise<MessageResponseDto> {
    return this.usersService.sendConfirmationEmail(ip, localeDto.locale, user);
  }

  @ApiOperation({ summary: 'Confirm email' })
  @ApiOkResponse({ type: MessageResponseDto })
  @ApiBadRequestResponse({ description: 'Token expired' })
  @ApiNotFoundResponse({ description: 'Token not found / User not found' })
  @ApiForbiddenResponse({ description: 'Invalid CSRF token' })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @HttpCode(HttpStatus.OK)
  @Post('confirm')
  public async confirmEmail(
    @Ip() ip: string,
    @Body() confirmEmailDto: ConfirmEmailDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<MessageResponseDto> {
    return this.usersService.confirmEmail(ip, confirmEmailDto, req, res);
  }

  @Auth()
  @ApiOperation({ summary: 'Get current user (base info in edit mode)' })
  @ApiOkResponse({ type: AuthResponseDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('me')
  public async getCurrentUser(
    @CurrentUser('id') id: string,
  ): Promise<AuthResponseDto> {
    return this.usersService.getUserById(id, 'edit');
  }

  @ApiOperation({ summary: 'Check email' })
  @ApiOkResponse({ type: EmailValidationResponseDto })
  @Get('check-email')
  public async checkEmailAvailable(
    @Query('email') email: string,
  ): Promise<EmailValidationResponseDto> {
    return this.usersService.checkEmailAvailable(email);
  }

  @ApiOperation({ summary: 'Password recovery token verification' })
  @ApiOkResponse({ type: TokenValidationResponseDto })
  @Get('validate-password-token')
  public async validateToken(
    @Query('token') token: string,
  ): Promise<TokenValidationResponseDto> {
    return this.usersService.validateToken(token);
  }

  @ApiOperation({ summary: 'Send email to reset your password' })
  @ApiOkResponse({ type: String })
  @ApiTooManyRequestsResponse({
    description: 'You have used up all your attempts. Please try again later.',
  })
  @ApiForbiddenResponse({ description: 'Invalid CSRF token' })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @HttpCode(HttpStatus.OK)
  @Post('request-password-reset')
  public async sendPasswordResetUrl(
    @Ip() ip: string,
    @Body() body: EmailWithLocaleDto,
  ): Promise<string> {
    return this.usersService.sendPasswordResetUrl(ip, body);
  }

  @ApiOperation({ summary: 'Get password reset token by id' })
  @ApiOkResponse({ type: EmailResponseDto })
  @ApiNotFoundResponse({ description: 'Token not found' })
  @Get('password-reset-token')
  public async getPasswordResetToken(
    @Query('requestId') id: string,
  ): Promise<EmailResponseDto> {
    return this.usersService.getPasswordResetToken(id);
  }

  @ApiOperation({ summary: 'Reset password' })
  @ApiOkResponse({ type: MessageResponseDto })
  @ApiBadRequestResponse({
    description: 'Invalid or expired token',
  })
  @ApiForbiddenResponse({ description: 'Invalid CSRF token' })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  public async resetPassword(
    @Ip() ip: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<MessageResponseDto> {
    return this.usersService.resetPassword(ip, resetPasswordDto);
  }

  @Auth()
  @ApiOperation({
    summary: 'Update current user email',
  })
  @ApiOkResponse({ type: AuthResponseDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiConflictResponse({ description: 'Email is already in use' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Invalid CSRF token' })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @Patch('me/email')
  public async updateEmail(
    @CurrentUser('id') id: string,
    @Ip() ip: string,
    @Body() emailDto: EmailWithLocaleDto,
  ): Promise<AuthResponseDto> {
    return this.usersService.updateEmail(id, ip, emailDto);
  }

  @User()
  @ApiOperation({
    summary: 'Update current user (first name, last name, desired roles)',
  })
  @ApiOkResponse({ type: AuthResponseDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Invalid CSRF token' })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @Patch('me')
  public async updateUser(
    @CurrentUser('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<AuthResponseDto> {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @User()
  @ApiOperation({
    summary: 'Get projects of current user',
  })
  @ApiOkResponse({ type: ProjectsListResponseDto })
  @ApiForbiddenResponse({ description: 'Access denied: email not confirmed' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('me/projects')
  public async getMyProjects(
    @CurrentUser('id') id: string,
    @Query() query: UserProjectsFilterDto,
  ): Promise<ProjectsListResponseDto> {
    return this.usersService.getUserProjects(
      id,
      query.page,
      query.limit,
      query.status,
    );
  }

  @User()
  @ApiOperation({
    summary: 'Get user projects',
  })
  @ApiOkResponse({ type: ProjectsListResponseDto })
  @ApiForbiddenResponse({ description: 'Access denied: email not confirmed' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get(':id/projects')
  public async getUserProjects(
    @UUIDParam('id') id: string,
    @Query() query: UserProjectsFilterDto,
  ): Promise<ProjectsListResponseDto> {
    return this.usersService.getUserProjects(
      id,
      query.page,
      query.limit,
      query.status,
    );
  }

  @User()
  @ApiOperation({ summary: 'Get user by id' })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiForbiddenResponse({ description: 'Access denied: email not confirmed' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get(':id')
  public async getUserById(
    @UUIDParam('id') id: string,
  ): Promise<UserResponseDto> {
    return this.usersService.getUserById(id, 'view');
  }

  @User()
  @ApiOperation({
    summary: 'Get list of users with filters and pagination',
  })
  @ApiOkResponse({ type: UsersListResponseDto })
  @ApiForbiddenResponse({ description: 'Access denied: email not confirmed' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('')
  public async getUsers(
    @Query() query: UsersFilterDto,
  ): Promise<UsersListResponseDto> {
    return this.usersService.getUsers(query);
  }

  @User()
  @ApiOperation({
    summary: 'Get current user invites',
  })
  @ApiOkResponse({ type: [ProjectParticipationResponseDto] })
  @ApiForbiddenResponse({ description: 'Access denied: email not confirmed' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('me/invites')
  public async getInvites(
    @CurrentUser('id') id: string,
  ): Promise<ProjectParticipationResponseDto[]> {
    return this.usersService.getInvites(id);
  }

  @User()
  @ApiOperation({
    summary: 'Get current user requests',
  })
  @ApiOkResponse({ type: [ProjectParticipationResponseDto] })
  @ApiForbiddenResponse({ description: 'Access denied: email not confirmed' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('me/requests')
  public async getRequests(
    @CurrentUser('id') id: string,
  ): Promise<ProjectParticipationResponseDto[]> {
    return this.usersService.getRequests(id);
  }

  @ApiOperation({ summary: 'Delete password recovery token' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'Token not found' })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('password-token')
  public async deletePasswordToken(
    @Query('token') token: string,
  ): Promise<void> {
    return this.usersService.cancelResetPassword(token);
  }

  @User()
  @ApiOperation({
    summary: `Get requests by user id in current user's projects`,
  })
  @ApiOkResponse({ type: [ProjectParticipationResponseDto] })
  @ApiForbiddenResponse({ description: 'Access denied: email not confirmed' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get(':id/requests')
  public async getRequestsByUserId(
    @UUIDParam('id') id: string,
    @CurrentUser('id') ownerId: string,
  ): Promise<ProjectParticipationResponseDto[]> {
    return this.usersService.getRequests(id, ownerId);
  }

  @User()
  @ApiOperation({
    summary: `Get invites by user id in current user's projects`,
  })
  @ApiOkResponse({ type: [ProjectParticipationResponseDto] })
  @ApiForbiddenResponse({ description: 'Access denied: email not confirmed' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get(':id/invites')
  public async getInvitesByUserId(
    @UUIDParam('id') id: string,
    @CurrentUser('id') ownerId: string,
  ): Promise<ProjectParticipationResponseDto[]> {
    return this.usersService.getInvites(id, ownerId);
  }
}
