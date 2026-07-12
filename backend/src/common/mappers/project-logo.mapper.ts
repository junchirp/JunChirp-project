import { ProjectLogo } from '@prisma/client';
import { ProjectLogoResponseDto } from '../../projects/dto/project-logo.response-dto';

export class ProjectLogoMapper {
  public static toResponse(logo: ProjectLogo): ProjectLogoResponseDto {
    return {
      id: logo.id,
      url: logo.url,
      width: logo.width,
      height: logo.height,
    };
  }
}
