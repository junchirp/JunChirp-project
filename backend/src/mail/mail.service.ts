import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import {
  Project,
  ProjectCategory,
  ProjectRole,
  ProjectRoleType,
  SupportRequest,
  User,
} from '@prisma/client';
import { Participation } from '../shared/types/participation.type';
import {
  LocaleEmailSubjectType,
  LocaleType,
} from '../shared/types/locale.type';
import { AuthResponseDto } from '../users/dto/auth.response-dto';

@Injectable()
export class MailService {
  public constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  public async sendVerificationMail(email: string, url: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      from: `Support Team <${this.configService.get<string>('EMAIL_USER')}>`,
      subject: 'Підтвердження електронної пошти',
      template: './confirmation-email',
      context: { url },
    });
  }

  public async sendResetPasswordMail(
    email: string,
    url: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      from: `Support Team <${this.configService.get<string>('EMAIL_USER')}>`,
      subject: 'Твоє посилання для відновлення паролю',
      template: './reset-password-email',
      context: { url },
    });
  }

  public async sendParticipationInvite(
    url: string,
    invite: Participation & {
      projectRole: ProjectRole & {
        roleType: ProjectRoleType;
        project: Project & {
          category: ProjectCategory;
          roles: (ProjectRole & {
            roleType: ProjectRoleType;
            user:
              | (User & {
                  desiredRoles: ProjectRoleType[];
                })
              | null;
          })[];
        };
      };
    },
    user: AuthResponseDto,
    locale: LocaleType,
  ): Promise<void> {
    const subjects: LocaleEmailSubjectType = {
      en: 'Запрошення в проєкт',
      ua: 'Запрошення в проєкт',
    };

    const subject = subjects[locale] ?? subjects.ua;

    await this.mailerService.sendMail({
      to: user.email,
      from: `Support Team <${this.configService.get<string>('EMAIL_USER')}>`,
      subject: subject,
      template: `./participation-invite-${locale}`,
      context: { url, invite },
    });
  }

  public async sendParticipationRequest(
    url: string,
    request: Participation & {
      projectRole: ProjectRole & {
        roleType: ProjectRoleType;
        project: Project & { owner: User };
      };
    },
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: request.projectRole.project.owner.email,
      from: `Support Team <${this.configService.get<string>('EMAIL_USER')}>`,
      subject: 'Запит на участь у твоєму проєкті',
      template: './participation-request',
      context: { url, request },
    });
  }

  public async sendSupportRequest(
    request: SupportRequest,
    locale: LocaleType,
  ): Promise<void> {
    const subjects: LocaleEmailSubjectType = {
      en: 'Your support request has been received',
      ua: 'Твій запит на підтримку отримано',
    };

    const subject = subjects[locale] ?? subjects.ua;

    await this.mailerService.sendMail({
      to: request.email,
      from: `Support Team <${this.configService.get<string>('EMAIL_USER')}>`,
      subject: subject,
      template: `./support-request-${locale}`,
      context: { request },
    });
  }
}
