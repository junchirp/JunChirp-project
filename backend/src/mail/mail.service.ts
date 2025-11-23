import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import {
  Project,
  ProjectRole,
  ProjectRoleType,
  SupportRequest,
  User,
} from '@prisma/client';
import { Participation } from '../shared/types/participation.type';
import { LocaleType } from '../shared/types/locale.type';

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
      user: User & {
        desiredRoles: ProjectRoleType[];
        activeProjectsCount: number;
      };
      projectRole: ProjectRole & {
        roleType: ProjectRoleType;
        project: Project;
      };
    },
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: invite.user.email,
      from: `Support Team <${this.configService.get<string>('EMAIL_USER')}>`,
      subject: 'Запрошення в проєкт',
      template: './participation-invite',
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
    let subject: string;
    switch (locale) {
      case 'en':
        subject = 'Your support request has been received';
        break;
      case 'ua':
        subject = 'Твій запит на підтримку отримано';
        break;
      default:
        subject = 'Твій запит на підтримку отримано';
    }

    await this.mailerService.sendMail({
      to: request.email,
      from: `Support Team <${this.configService.get<string>('EMAIL_USER')}>`,
      subject: subject,
      template: `./support-request-${locale}`,
      context: { request },
    });
  }
}
