import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { Type } from '@nestjs/common/interfaces/type.interface';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform {
  public async transform<T>(value: T, metadata: ArgumentMetadata): Promise<T> {
    const { metatype, type } = metadata;

    if (
      type === 'param' ||
      type === 'custom' ||
      !metatype ||
      !this.toValidate(metatype)
    ) {
      return value;
    }

    const object = plainToInstance(metatype as Type<object>, value, {
      enableImplicitConversion: true,
    });

    const errors = await validate(object);

    if (errors.length) {
      const messages = this.formatErrors(errors);

      throw new BadRequestException(messages, 'Validation Error');
    }

    return object as T;
  }

  private toValidate(metatype: Type<unknown>): boolean {
    const types: Type<unknown>[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private formatErrors(errors: ValidationError[]): string[] {
    const messages: string[] = [];

    const parse = (error: ValidationError, parent?: string) => {
      const property = parent ? `${parent}.${error.property}` : error.property;

      if (error.constraints) {
        messages.push(
          `${property} - ${Object.values(error.constraints).join(', ')}`,
        );
      }

      if (error.children?.length) {
        error.children.forEach((child) => parse(child, property));
      }
    };

    errors.forEach((error) => parse(error));

    return messages;
  }
}
