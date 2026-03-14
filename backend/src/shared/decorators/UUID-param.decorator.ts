import { Param } from '@nestjs/common';
import { ParseUUIDv4Pipe } from '../pipes/parse-UUIDv4/parse-UUIDv4.pipe';

export const UUIDParam = (paramName: string): ParameterDecorator =>
  Param(paramName, ParseUUIDv4Pipe);
