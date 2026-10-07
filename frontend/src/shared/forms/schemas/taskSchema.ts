import { z, ZodArray, ZodDate, ZodNullable, ZodObject, ZodString } from 'zod';
import { TFunctionType } from '@/shared/types/t-function.type';
import { taskNameValidator } from '@/shared/forms/validators/taskNameValidator';
import { taskDescriptionValidator } from '@/shared/forms/validators/taskDescriptionValidator';

export const taskPrioritySchema = z.enum({
  critical: 'critical',
  high: 'high',
  medium: 'medium',
  low: 'low',
});

export const taskSchemaStatic = z.object({
  taskName: z.string(),
  description: z.string().nullable(),
  taskStatusId: z.string(),
  priority: taskPrioritySchema,
  deadline: z.date().nullable(),
  assigneesIds: z.array(z.string()),
});

export const taskSchema = (
  t: TFunctionType,
): ZodObject<{
  taskName: ZodString;
  description: ZodNullable<ZodString>;
  taskStatusId: ZodString;
  priority: typeof taskPrioritySchema;
  deadline: ZodNullable<ZodDate>;
  assigneesIds: ZodArray<ZodString>;
}> =>
  taskSchemaStatic.extend({
    taskName: taskNameValidator(t),
    description: taskDescriptionValidator(t).nullable(),
  });
