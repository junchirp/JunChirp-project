import { HttpException, HttpStatus } from '@nestjs/common';

export class TooManyRequestsException extends HttpException {
  public constructor(
    message = 'Too Many Requests Exception',
    attemptsCount?: number,
    retryAfter?: Date,
  ) {
    super(
      {
        message,
        error: 'Too Many Requests',
        attemptsCount,
        retryAfter,
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
      },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}
