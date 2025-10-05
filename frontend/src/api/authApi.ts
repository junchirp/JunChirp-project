import mainApi from './mainApi';
import { SoftSkillInterface } from '@/shared/interfaces/soft-skill.interface';
import { HardSkillInterface } from '@/shared/interfaces/hard-skill.interface';
import { EducationInterface } from '@/shared/interfaces/education.interface';
import { SocialInterface } from '@/shared/interfaces/social.interface';
import { RegistrationInterface } from '../shared/interfaces/registration.interface';
import { UserInterface } from '../shared/interfaces/user.interface';
import { LoginInterface } from '../shared/interfaces/login.interface';
import { MessageInterface } from '../shared/interfaces/message.interface';
import { EmailInterface } from '../shared/interfaces/email.interface';
import { ConfirmEmailInterface } from '../shared/interfaces/confirm-email.interface';
import { TokenValidationInterface } from '../shared/interfaces/token-validation.interface';
import { ResetPasswordInterface } from '../shared/interfaces/reset-password.interface';

export const authApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<UserInterface, RegistrationInterface>({
      query: (userData) => ({
        url: 'auth/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['auth'],
    }),
    getMe: builder.query<UserInterface, undefined>({
      query: () => ({
        url: 'users/me',
      }),
      providesTags: (result) =>
        result
          ? [
              'auth',
              { type: 'soft-skills', id: 'LIST' },
              ...result.softSkills.map((skill: SoftSkillInterface) => ({
                type: 'soft-skills' as const,
                id: skill.id,
              })),
              { type: 'hard-skills', id: 'LIST' },
              ...result.hardSkills.map((skill: HardSkillInterface) => ({
                type: 'hard-skills' as const,
                id: skill.id,
              })),
              { type: 'educations', id: 'LIST' },
              ...result.educations.map((edu: EducationInterface) => ({
                type: 'educations' as const,
                id: edu.id,
              })),
              { type: 'socials', id: 'LIST' },
              ...result.socials.map((social: SocialInterface) => ({
                type: 'socials' as const,
                id: social.id,
              })),
            ]
          : ([
              'auth',
              { type: 'soft-skills', id: 'LIST' },
              { type: 'hard-skills', id: 'LIST' },
              { type: 'educations', id: 'LIST' },
              { type: 'socials', id: 'LIST' },
            ] as const),
    }),
    login: builder.mutation<UserInterface, LoginInterface>({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: [
        'auth',
        { type: 'soft-skills', id: 'LIST' },
        { type: 'hard-skills', id: 'LIST' },
        { type: 'educations', id: 'LIST' },
        { type: 'socials', id: 'LIST' },
      ],
    }),
    logout: builder.mutation<MessageInterface, undefined>({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
      }),
      invalidatesTags: [
        'auth',
        'my-projects',
        { type: 'soft-skills', id: 'LIST' },
        { type: 'hard-skills', id: 'LIST' },
        { type: 'educations', id: 'LIST' },
        { type: 'socials', id: 'LIST' },
      ],
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
    updateUser: builder.mutation<UserInterface, UpdateUserType>({
      query: (data) => ({
        url: 'users/me',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['auth', 'users'],
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
  useConfirmEmailMutation,
  useRequestPasswordResetMutation,
  useValidateTokenQuery,
  useResetPasswordMutation,
  useCancelResetPasswordMutation,
} = authApi;
