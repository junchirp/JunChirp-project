import { CreateProjectDto } from './create-project.dto';
import { OmitType } from '@nestjs/swagger';

export class UpdateProjectDto extends OmitType(CreateProjectDto, ['locale']) {}
