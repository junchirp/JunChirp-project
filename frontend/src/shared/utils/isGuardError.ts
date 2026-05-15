import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export function isGuardError(
  error?: FetchBaseQueryError | SerializedError,
): boolean {
  return !!(
    error &&
    'data' in error &&
    error.data &&
    typeof error.data === 'object' &&
    'code' in error.data &&
    error.data.code === 'GUARD_ERROR'
  );
}
