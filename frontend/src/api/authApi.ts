import mainApi from './mainApi';
import { RegistrationInterface } from '@/shared/interfaces/registration.interface';
import { LoginInterface } from '@/shared/interfaces/login.interface';
import { MessageInterface } from '@/shared/interfaces/message.interface';
import { EmailInterface } from '@/shared/interfaces/email.interface';
import { ConfirmEmailInterface } from '@/shared/interfaces/confirm-email.interface';
import { TokenValidationInterface } from '@/shared/interfaces/token-validation.interface';
import { ResetPasswordInterface } from '@/shared/interfaces/reset-password.interface';
import { AuthInterface } from '@/shared/interfaces/auth.interface';
import { UpdateUserInterface } from '@/shared/interfaces/update-user.interface';

const USER_RELATED_TAGS = [
  'auth',
  'soft-skills',
  'hard-skills',
  'educations',
  'socials',
  'my-projects',
  'invites-me-in-projects',
  'invites-in-my-projects',
  'my-requests-in-projects',
  'requests-in-my-projects',
] as const;

export const authApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<AuthInterface, RegistrationInterface>({
      query: (userData) => ({
        url: 'auth/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: USER_RELATED_TAGS,
    }),
    getMe: builder.query<AuthInterface, undefined>({
      query: () => ({
        url: 'users/me',
      }),
      providesTags: ['auth'],
    }),
    login: builder.mutation<AuthInterface, LoginInterface>({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: USER_RELATED_TAGS,
    }),
    logout: builder.mutation<MessageInterface, undefined>({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['auth'],
    }),
    sendConfirmationEmail: builder.mutation<MessageInterface, EmailInterface>({
      query: (data) => ({
        url: 'users/send-confirmation-email',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['auth'],
    }),
    confirmEmail: builder.mutation<MessageInterface, ConfirmEmailInterface>({
      query: (data) => ({
        url: 'users/confirm',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['auth', 'users'],
    }),
    requestPasswordReset: builder.mutation<MessageInterface, EmailInterface>({
      query: (data) => ({
        url: 'users/request-password-reset',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['auth'],
    }),
    updateUser: builder.mutation<AuthInterface, UpdateUserInterface>({
      query: (data) => ({
        url: 'users/me',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['auth', 'users'],
    }),
    updateEmail: builder.mutation<AuthInterface, EmailInterface>({
      query: (data) => ({
        url: 'users/me/email',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['auth'],
    }),
    validateToken: builder.query<TokenValidationInterface, string>({
      query: (token) => ({
        url: `users/validate-password-token?token=${encodeURIComponent(token)}`,
      }),
    }),
    resetPassword: builder.mutation<MessageInterface, ResetPasswordInterface>({
      query: (data) => ({
        url: 'users/reset-password',
        method: 'POST',
        body: data,
      }),
    }),
    cancelResetPassword: builder.mutation<void, string>({
      query: (token) => ({
        url: `users/password-token?token=${encodeURIComponent(token)}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
  useSendConfirmationEmailMutation,
  useUpdateUserMutation,
  useUpdateEmailMutation,
  useConfirmEmailMutation,
  useRequestPasswordResetMutation,
  useValidateTokenQuery,
  useResetPasswordMutation,
  useCancelResetPasswordMutation,
} = authApi;
