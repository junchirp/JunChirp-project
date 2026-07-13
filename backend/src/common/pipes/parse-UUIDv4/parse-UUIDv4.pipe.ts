import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

@Injectable()
export class ParseUUIDv4Pipe implements PipeTransform {
  public transform(value: unknown, metadata: ArgumentMetadata): string {
    if (typeof value !== 'string') {
      throw new BadRequestException(
        `${metadata.data} - Must be a string`,
        'Validation Error',
      );
    }

    if (!UUID_V4_REGEX.test(value)) {
      throw new BadRequestException(
        `${metadata.data} - Must be a valid UUIDv4`,
        'Validation Error',
      );
    }

    return value;
  }
}
