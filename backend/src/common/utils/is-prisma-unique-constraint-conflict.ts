import { isPrismaError } from './is-prisma-error';

export const isPrismaUniqueConstraintConflict = (
  error: unknown,
  fields: string[],
): boolean => {
  if (!isPrismaError(error) || error.code !== 'P2002') {
    return false;
  }

  const target = error.meta?.target;
  return (
    Array.isArray(target) && fields.every((field) => target.includes(field))
  );
};
