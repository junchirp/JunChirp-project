import { PrismaErrorHandlerInterface } from '../interfaces/prisma-error-handler.interface';
import { isPrismaError } from './is-prisma-error';

export function throwPrismaError(
  error: unknown,
  handlers: PrismaErrorHandlerInterface | PrismaErrorHandlerInterface[],
): never {
  if (!isPrismaError(error)) {
    throw error;
  }

  const handler = (Array.isArray(handlers) ? handlers : [handlers]).find(
    ({ code }) => code === error.code,
  );

  if (!handler) {
    throw error;
  }

  throw new handler.exception(handler.message);
}
