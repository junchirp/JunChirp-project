import { z } from 'zod';
import { nonEmptyValidator } from '../validators/nonEmptyValidator';
import { projectNameValidator } from '../validators/projectNameValidator';
import { projectDescriptionValidator } from '../validators/projectDescriptionValidator';
import { projectRolesValidator } from '../validators/projectRolesValidator';

export const projectSchema = z.object({
  projectName: projectNameValidator,
  description: projectDescriptionValidator,
  categoryId: nonEmptyValidator,
  rolesIds: projectRolesValidator,
});
