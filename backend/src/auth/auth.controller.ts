import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { ValidationPipe } from '../shared/pipes/validation/validation.pipe';
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

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  public constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Login' })
  @ApiOkResponse({ type: AuthResponseDto })
  @ApiUnauthorizedResponse({ description: 'Email or password is incorrect' })
  @ApiTooManyRequestsResponse({
    description: 'Too many failed attempts. Please try again later',
  })
  @ApiForbiddenResponse({ description: 'Invalid CSRF token' })
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
  @UsePipes(ValidationPipe)
  @Post('register')
  public async registration(
    @Body() createUserDto: CreateUserDto,
    @Ip() ip: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    return this.authService.registration(createUserDto, ip, res);
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
    return this.authService.regenerateAccessToken(req, res);
  }

  @Auth()
  @ApiOperation({ summary: 'Logout' })
  @ApiOkResponse({ type: MessageResponseDto })
  @ApiUnauthorizedResponse({ description: 'Token is invalid' })
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

  @Discord()
  @ApiOperation({ summary: 'Initiate Discord OAuth2 login' })
  @ApiResponse({ status: HttpStatus.FOUND })
  @ApiForbiddenResponse({ description: 'Access denied: email not confirmed' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @HttpCode(HttpStatus.FOUND)
  @Get('discord')
  // eslint-disable-next-line
  public async redirectToDiscord(): Promise<void> {}

  @Discord()
  @ApiOperation({ summary: 'Initiate Discord OAuth2 login' })
  @ApiResponse({ status: HttpStatus.FOUND })
  @HttpCode(HttpStatus.FOUND)
  @Get('discord/callback')
  public async handleDiscordCallback(
    @Req() req: Request,
    @Res() res: Response,
    @Query('state') state: string,
    @Query('returnUrl') _returnUrl: string,
  ): Promise<void> {
    return this.authService.handleDiscordCallback(req, res, state);
  }
}
