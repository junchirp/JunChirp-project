import { Controller, Get } from '@nestjs/common';
import { ProjectRolesService } from './project-roles.service';
import {
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ProjectRoleTypeResponseDto } from './dto/project-role-type.response-dto';
import { User } from '../auth/decorators/user.decorator';

@User()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('project-roles')
export class ProjectRolesController {
  public constructor(private projectRolesService: ProjectRolesService) {}

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

  // @Owner('body', 'projectId', 'project')
  // @ApiOperation({ summary: 'Create project role' })
  // @ApiCreatedResponse({ type: ProjectRoleResponseDto })
  // @ApiNotFoundResponse({
  //   description: 'Project or role type not found',
  // })
  // @ApiForbiddenResponse({
  //   description:
  //     'Access denied: you are not the project owner / Access denied: email not confirmed / Access denied: discord not confirmed / Invalid CSRF token',
  // })
  // @ApiHeader({
  //   name: 'x-csrf-token',
  //   description: 'CSRF token for the request',
  //   required: true,
  // })
  // @Post('')
  // public async createProjectRole(
  //   @Body() createProjectRoleDto: CreateProjectRoleDto,
  // ): Promise<ProjectRoleResponseDto> {
  //   return this.projectRolesService.createProjectRole(createProjectRoleDto);
  // }

  // @Owner('params', 'id', 'projectRole')
  // @ApiOperation({ summary: 'Delete project role' })
  // @ApiNoContentResponse()
  // @ApiNotFoundResponse({ description: 'Project role not found' })
  // @ApiForbiddenResponse({
  //   description:
  //     'Access denied: you are not the project owner / Access denied: email not confirmed / Access denied: discord not confirmed / Invalid CSRF token',
  // })
  // @ApiMethodNotAllowedResponse({
  //   description: 'You cannot delete the project owner role',
  // })
  // @ApiHeader({
  //   name: 'x-csrf-token',
  //   description: 'CSRF token for the request',
  //   required: true,
  // })
  // @HttpCode(HttpStatus.NO_CONTENT)
  // @Delete(':id')
  // public async deleteProjectRole(@UUIDParam('id') id: string): Promise<void> {
  //   return this.projectRolesService.deleteProjectRole(id);
  // }
}
