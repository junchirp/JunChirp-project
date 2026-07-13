import {
  fetchBaseQuery,
  BaseQueryFn,
  createApi,
  QueryReturnValue,
  FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query/react';
import type { FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { fetchNewCsrfToken, getCsrfToken } from './csrf';

interface CsrfErrorData {
  code: string;
  message?: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const isAuthRequest = (args: string | FetchArgs, method: string): boolean => {
  const url = typeof args === 'string' ? args : args.url;
  return (
    method === 'POST' &&
    (url.endsWith('auth/login') || url.endsWith('auth/register'))
  );
};

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include',
});

const isCsrfError = (error: FetchBaseQueryError | undefined): boolean => {
  return error
    ? error.status === 403 &&
        (error.data as CsrfErrorData)?.code === 'EBADCSRFTOKEN'
    : false;
};

const shouldRefreshCsrf = (
  args: string | FetchArgs,
  method: string,
): boolean => {
  if (method !== 'POST') {
    return false;
  }

  const url = typeof args === 'string' ? args : args.url;

  return (
    url.endsWith('auth/login') ||
    url.endsWith('auth/register') ||
    url.endsWith('auth/logout') ||
    url.endsWith('users/confirm')
  );
};

const baseQueryWithReauthAndCsrf: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const method = typeof args === 'string' ? 'GET' : (args.method ?? 'GET');

  const attachCsrfHeader = async (
    arg: string | FetchArgs,
  ): Promise<string | FetchArgs> => {
    const token = getCsrfToken() ?? (await fetchNewCsrfToken());

    if (!token) {
      return arg;
    }

    if (typeof arg === 'string') {
      return {
        url: arg,
        method,
        headers: { 'x-csrf-token': token },
      };
    } else {
      return {
        ...arg,
        headers: {
          ...arg.headers,
          'x-csrf-token': token,
        },
      };
    }
  };

  if (method !== 'GET') {
    args = await attachCsrfHeader(args);
  }

  let result = await baseQuery(args, api, extraOptions);

  const retryRequest = async (): Promise<
    QueryReturnValue<
      unknown,
      FetchBaseQueryError,
      FetchBaseQueryMeta | undefined
    >
  > => {
    args = await attachCsrfHeader(args);
    return baseQuery(args, api, extraOptions);
  };

  if (isCsrfError(result.error)) {
    await fetchNewCsrfToken();
    result = await retryRequest();
  }

  if (result.error?.status === 401 && !isAuthRequest(args, method)) {
    const token = getCsrfToken() ?? (await fetchNewCsrfToken());

    try {
      const refreshResp = await fetch(`${BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        credentials: 'include',
        headers: token ? { 'x-csrf-token': token } : {},
      });

      if (refreshResp.ok) {
        result = await retryRequest();
      } else {
        api.dispatch({ type: 'auth/logout' });

        return {
          error: {
            status: 401,
            data: { message: 'Unauthorized' },
          },
        };
      }
    } catch {
      api.dispatch({ type: 'auth/logout' });

      return {
        error: {
          status: 401,
          data: { message: 'Network error' },
        },
      };
    }
  }

  if (!result.error && shouldRefreshCsrf(args, method)) {
    await fetchNewCsrfToken();
  }
  return result;
};

const mainApi = createApi({
  reducerPath: 'mainApi',
  baseQuery: baseQueryWithReauthAndCsrf,
  tagTypes: [
    // current user
    'auth', // CURRENT

    // reference lists
    'soft-skills',
    'hard-skills',
    'educations',
    'socials',

    // user entities
    'users', // LIST | userId

    // project collections
    'my-projects', // LIST
    'user-projects', // userId
    'project-cards', // LIST | projectId

    // project entities
    'projects', // projectId

    // invitations
    'invites-me-in-projects', // LIST
    'invites-in-my-projects', // LIST | userId
    'invites', // ProjectId

    // requests
    'my-requests-in-projects', // LIST
    'requests-in-my-projects', // LIST | userId
    'requests', // projectId

    // documents
    'docs', // projectId
  ],
  endpoints: () => ({}),
});

export default mainApi;
