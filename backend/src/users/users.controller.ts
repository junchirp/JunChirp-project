import { Body, Controller, Get, Patch, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { Auth } from '../auth/decorators/auth.decorator';
import {
  ApiForbiddenResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserResponseDto } from './dto/user.response-dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersListResponseDto } from './dto/users-list.response-dto';
import { UsersFilterDto } from './dto/users-filter.dto';
import { User } from '../auth/decorators/user.decorator';
import { AuthResponseDto } from './dto/auth.response-dto';
import { UUIDParam } from '../common/decorators/UUID-param.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CountResponseDto } from './dto/count.response-dto';

@Auth()
@Controller('users')
export class UsersController {
  public constructor(private readonly usersService: UsersService) {}

  @User()
  @ApiOperation({ summary: `Get current user's active projects count` })
  @ApiOkResponse({ type: CountResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('me/active-projects-count')
  public async getActiveProjectsCount(
    @CurrentUser('id') id: string,
  ): Promise<CountResponseDto> {
    return this.usersService.getActiveProjectsCount(id);
  }

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
}
