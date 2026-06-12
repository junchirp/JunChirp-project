import mainApi from './mainApi';
import { RegistrationInterface } from '@/shared/interfaces/registration.interface';
import { LoginInterface } from '@/shared/interfaces/login.interface';
import { MessageInterface } from '@/shared/interfaces/message.interface';
import { EmailWithLocaleInterface } from '@/shared/interfaces/email-with-locale.interface';
import { ConfirmEmailInterface } from '@/shared/interfaces/confirm-email.interface';
import { TokenValidationInterface } from '@/shared/interfaces/token-validation.interface';
import { ResetPasswordInterface } from '@/shared/interfaces/reset-password.interface';
import { AuthInterface } from '@/shared/interfaces/auth.interface';
import { UpdateUserInterface } from '@/shared/interfaces/update-user.interface';
import { LocaleInterface } from '@/shared/interfaces/locale.interface';
import { ConfirmEmailWithLocaleInterface } from '@/shared/interfaces/confirm-email-with-locale.interface';
import { EmailWithIdInterface } from '@/shared/interfaces/email-with-id.interface';
import { setUser } from '@/redux/auth/authSlice';
import { projectsApi } from '@/api/projectsApi';

const USER_RELATED_TAGS = [
  { type: 'auth', id: 'CURRENT' },
  { type: 'soft-skills', id: 'LIST' },
  { type: 'hard-skills', id: 'LIST' },
  { type: 'educations', id: 'LIST' },
  { type: 'socials', id: 'LIST' },
  { type: 'my-projects', id: 'LIST' },
  { type: 'invites-me-in-projects', id: 'LIST' },
  { type: 'invites-in-my-projects', id: 'LIST' },
  { type: 'my-requests-in-projects', id: 'LIST' },
  { type: 'requests-in-my-projects', id: 'LIST' },
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
    getMe: builder.query<AuthInterface, void>({
      query: () => ({
        url: 'users/me',
      }),
      providesTags: [{ type: 'auth', id: 'CURRENT' }],
    }),
    login: builder.mutation<AuthInterface, LoginInterface>({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: USER_RELATED_TAGS,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
          dispatch(projectsApi.util.resetApiState());
        } catch {
          return;
        }
      },
    }),
    logout: builder.mutation<MessageInterface, void>({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'auth', id: 'CURRENT' }],
    }),
    sendConfirmationEmail: builder.mutation<MessageInterface, LocaleInterface>({
      query: (data) => ({
        url: 'users/send-confirmation-email',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'auth', id: 'CURRENT' }],
    }),
    resendConfirmationEmail: builder.mutation<
      MessageInterface,
      ConfirmEmailWithLocaleInterface
    >({
      query: (data) => ({
        url: 'users/send-confirmation-email/resend',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'auth', id: 'CURRENT' }],
    }),
    confirmEmail: builder.mutation<MessageInterface, ConfirmEmailInterface>({
      query: (data) => ({
        url: 'users/confirm',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [
        { type: 'auth', id: 'CURRENT' },
        { type: 'users', id: 'LIST' },
      ],
    }),
    requestPasswordReset: builder.mutation<
      { id: string },
      EmailWithLocaleInterface
    >({
      query: (data) => ({
        url: 'users/request-password-reset',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'auth', id: 'CURRENT' }],
    }),
    updateUser: builder.mutation<AuthInterface, UpdateUserInterface>({
      query: (data) => ({
        url: 'users/me',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: [
        { type: 'auth', id: 'CURRENT' },
        { type: 'users', id: 'LIST' },
      ],
    }),
    updateEmail: builder.mutation<AuthInterface, EmailWithLocaleInterface>({
      query: (data) => ({
        url: 'users/me/email',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: [{ type: 'auth', id: 'CURRENT' }],
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
    getPasswordResetToken: builder.query<EmailWithIdInterface, string>({
      query: (id) => ({
        url: `users/password-reset-token?requestId=${id}`,
      }),
    }),
    getProjectsCount: builder.query<{ count: number }, void>({
      query: () => ({
        url: 'users/me/active-projects-count',
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
  useResendConfirmationEmailMutation,
  useUpdateUserMutation,
  useUpdateEmailMutation,
  useConfirmEmailMutation,
  useRequestPasswordResetMutation,
  useValidateTokenQuery,
  useResetPasswordMutation,
  useCancelResetPasswordMutation,
  useGetPasswordResetTokenQuery,
  useLazyGetProjectsCountQuery,
} = authApi;
