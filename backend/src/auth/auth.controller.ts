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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { Auth } from './decorators/auth.decorator';
import { MessageResponseDto } from '../users/dto/message.response-dto';
import { GoogleInitGuard } from './guards/google-init/google-init.guard';
import { Discord } from './decorators/discord.decorator';
import { AuthResponseDto } from '../users/dto/auth.response-dto';
import { GoogleCallbackGuard } from './guards/google-callback/google-callback.guard';
import { ConfirmEmailWithLocaleDto } from '../users/dto/confirm-email-with-locale.dto';
import { LocaleDto } from '../common/dto/locale.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ConfirmEmailDto } from '../users/dto/confirm-email.dto';
import { EmailValidationResponseDto } from '../users/dto/email-validation.response-dto';
import { TokenValidationResponseDto } from '../users/dto/token-validation.response-dto';
import { IdResponseDto } from '../users/dto/id.response-dto';
import { RequestResetPasswordDto } from '../users/dto/request-reset-password.dto';
import { EmailResponseDto } from '../users/dto/email.response-dto';
import { ResetPasswordDto } from '../users/dto/reset-password.dto';
import { EmailWithLocaleDto } from '../users/dto/email-with-locale.dto';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login' })
  @ApiOkResponse({ type: AuthResponseDto })
  @ApiUnauthorizedResponse({ description: 'Email or password is incorrect' })
  @ApiTooManyRequestsResponse({
    description: 'Too many failed attempts. Please try again later',
  })
  @ApiForbiddenResponse({ description: 'Invalid CSRF token / User is blocked' })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @ApiBody({ type: LoginDto })
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  public async login(
    @Ip() ip: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    return this.authService.login(ip, req, res);
  }

  @ApiOperation({ summary: 'Registration' })
  @ApiCreatedResponse({ type: AuthResponseDto })
  @ApiConflictResponse({ description: 'User with this email already exists' })
  @ApiForbiddenResponse({ description: 'Invalid CSRF token' })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @Post('register')
  public async registration(
    @Body() createUserDto: CreateUserDto,
    @Ip() ip: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    return this.authService.registration(createUserDto, ip, req, res);
  }

  @ApiOperation({ summary: 'Refresh token' })
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse({ description: 'Invalid or expired refresh token' })
  @ApiForbiddenResponse({ description: 'Invalid CSRF token' })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('refresh-token')
  public async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    return this.authService.regenerateTokens(req, res);
  }

  @Auth()
  @ApiOperation({ summary: 'Logout' })
  @ApiOkResponse({ type: MessageResponseDto })
  @ApiForbiddenResponse({ description: 'Invalid CSRF token' })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  public async logout(
    @Ip() ip: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<MessageResponseDto> {
    return this.authService.logout(ip, req, res);
  }

  @ApiOperation({ summary: 'Initiate Google OAuth2 login' })
  @ApiResponse({ status: HttpStatus.FOUND })
  @HttpCode(HttpStatus.FOUND)
  @UseGuards(GoogleInitGuard)
  @Get('google')
  // eslint-disable-next-line
  public async googleAuth(): Promise<void> {}

  @ApiOperation({ summary: 'Initiate Google OAuth2 login' })
  @ApiResponse({ status: HttpStatus.FOUND })
  @HttpCode(HttpStatus.FOUND)
  @Get('google/callback')
  @UseGuards(GoogleCallbackGuard)
  @ApiOperation({ summary: 'Callback endpoint for Google authentication' })
  public async googleRedirect(
    @Ip() ip: string,
    @Req() req: Request,
    @Res() res: Response,
    @Query('state') state: string,
    @Query('error') error?: string,
  ): Promise<void> {
    return error === 'access_denied'
      ? this.authService.handleGoogleCancel(ip, res, state)
      : this.authService.handleGoogleCallback(ip, req, res, state, error);
  }

  @Discord('init')
  @ApiOperation({ summary: 'Initiate Discord OAuth2 login' })
  @ApiResponse({ status: HttpStatus.FOUND })
  @ApiForbiddenResponse({ description: 'Access denied: email not confirmed' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @HttpCode(HttpStatus.FOUND)
  @Get('discord')
  // eslint-disable-next-line
  public async redirectToDiscord(): Promise<void> {}

  @Discord('callback')
  @ApiOperation({ summary: 'Initiate Discord OAuth2 login' })
  @ApiResponse({ status: HttpStatus.FOUND })
  @HttpCode(HttpStatus.FOUND)
  @Get('discord/callback')
  public async handleDiscordCallback(
    @Req() req: Request,
    @Res() res: Response,
    @Query('state') state: string,
    @Query('error') error?: string,
  ): Promise<void> {
    return error === 'access_denied'
      ? this.authService.handleDiscordCancel(res, state)
      : this.authService.handleDiscordCallback(req, res, state, error);
  }

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
    return this.authService.resendConfirmationEmail(ip, confirmEmailWithLocale);
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
    return this.authService.sendConfirmationEmail(ip, localeDto.locale, user);
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
    return this.authService.confirmEmail(ip, confirmEmailDto, req, res);
  }

  @ApiOperation({ summary: 'Check email' })
  @ApiOkResponse({ type: EmailValidationResponseDto })
  @Get('check-email')
  public async checkEmailAvailable(
    @Query('email') email: string,
  ): Promise<EmailValidationResponseDto> {
    return this.authService.checkEmailAvailable(email);
  }

  @ApiOperation({ summary: 'Password recovery token verification' })
  @ApiOkResponse({ type: TokenValidationResponseDto })
  @Get('validate-password-token')
  public async validateToken(
    @Query('token') token: string,
  ): Promise<TokenValidationResponseDto> {
    return this.authService.validateToken(token);
  }

  @ApiOperation({ summary: 'Send email to reset your password' })
  @ApiOkResponse({ type: IdResponseDto })
  @ApiTooManyRequestsResponse({
    description: 'You have used up all your attempts. Please try again later.',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiForbiddenResponse({ description: 'Invalid CSRF token / User is blocked' })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @HttpCode(HttpStatus.OK)
  @Post('request-password-reset')
  public async sendPasswordResetUrl(
    @Ip() ip: string,
    @Body() body: RequestResetPasswordDto,
  ): Promise<IdResponseDto> {
    return this.authService.sendPasswordResetUrl(ip, body);
  }

  @ApiOperation({ summary: 'Get password reset token by id' })
  @ApiOkResponse({ type: EmailResponseDto })
  @ApiNotFoundResponse({ description: 'Token not found' })
  @Get('password-reset-token')
  public async getPasswordResetToken(
    @Query('requestId') id: string,
  ): Promise<EmailResponseDto> {
    return this.authService.getPasswordResetToken(id);
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
    return this.authService.resetPassword(ip, resetPasswordDto);
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
  @Patch('email')
  public async updateEmail(
    @CurrentUser('id') id: string,
    @Ip() ip: string,
    @Body() emailDto: EmailWithLocaleDto,
  ): Promise<AuthResponseDto> {
    return this.authService.updateEmail(id, ip, emailDto);
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
    return this.authService.cancelResetPassword(token);
  }
}
