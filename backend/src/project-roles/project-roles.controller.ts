import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ProjectRolesService } from './project-roles.service';
import {
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
import { ProjectRoleTypeResponseDto } from './dto/project-role-type.response-dto';
import { User } from '../auth/decorators/user.decorator';
import { Owner } from '../auth/decorators/owner.decorator';
import { ProjectRoleResponseDto } from './dto/project-role.response-dto';
import { CreateProjectRoleDto } from './dto/create-project-role.dto';
import { UUIDParam } from '../shared/decorators/UUID-param.decorator';

@User()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('project-roles')
export class ProjectRolesController {
  public constructor(
    private readonly projectRolesService: ProjectRolesService,
  ) {}

  @ApiOperation({
    summary: 'Get array of all project roles available on the platform',
  })
  @ApiOkResponse({ type: [ProjectRoleTypeResponseDto] })
  @ApiForbiddenResponse({
    description: 'Access denied: email not confirmed',
  })
  @Get('list')
  public async getProjectRoleTypes(): Promise<ProjectRoleTypeResponseDto[]> {
    return this.projectRolesService.getProjectRoleTypes();
  }

  @Owner('body', 'projectId', 'project')
  @ApiOperation({ summary: 'Create project role' })
  @ApiCreatedResponse({ type: ProjectRoleResponseDto })
  @ApiNotFoundResponse({
    description: 'Project or role type not found',
  })
  @ApiConflictResponse({
    description: 'This role already exists in the project',
  })
  @ApiForbiddenResponse({
    description:
      'Access denied: you are not the project owner / Access denied: email not confirmed / Access denied: discord not confirmed / Invalid CSRF token',
  })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @Post('')
  public async createProjectRole(
    @Body() createProjectRoleDto: CreateProjectRoleDto,
  ): Promise<ProjectRoleResponseDto> {
    return this.projectRolesService.createProjectRole(createProjectRoleDto);
  }

  @Owner('params', 'id', 'projectRole')
  @ApiOperation({ summary: 'Add one slot to the project role' })
  @ApiOkResponse({ type: ProjectRoleResponseDto })
  @ApiNotFoundResponse({ description: 'Project role not found' })
  @ApiForbiddenResponse({
    description:
      'Access denied: you are not the project owner / Access denied: email not confirmed / Access denied: discord not confirmed / Invalid CSRF token',
  })
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for the request',
    required: true,
  })
  @HttpCode(HttpStatus.OK)
  @Post(':id/slots')
  public async addProjectRoleSlot(
    @UUIDParam('id') id: string,
  ): Promise<ProjectRoleResponseDto> {
    return this.projectRolesService.addProjectRoleSlot(id);
  }

  @Owner('params', 'id', 'projectRole')
  @ApiOperation({ summary: 'Delete one slot in the project role' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'Project role not found' })
  @ApiConflictResponse({
    description: 'Cannot remove slot because all slots are occupied',
  })
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
  @Delete(':id/slots')
  public async deleteProjectRoleSlot(
    @UUIDParam('id') id: string,
  ): Promise<void> {
    return this.projectRolesService.deleteProjectRoleSlot(id);
  }
}
