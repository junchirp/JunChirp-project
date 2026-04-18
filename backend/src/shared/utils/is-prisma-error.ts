import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

export function isPrismaError(
  err: unknown,
): err is PrismaClientKnownRequestError {
  return err instanceof PrismaClientKnownRequestError;
}
