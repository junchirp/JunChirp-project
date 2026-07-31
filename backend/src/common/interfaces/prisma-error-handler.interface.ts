export interface PrismaErrorHandlerInterface {
  code: string;
  exception: new (message?: string) => Error;
  message: string;
}
