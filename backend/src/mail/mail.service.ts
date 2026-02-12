import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
import * as path from 'path';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { OAuth2Client } from 'google-auth-library';
import { RedisService } from '../redis/redis.service';
import { gmail_v1, google } from 'googleapis';

@Injectable()
export class MailService {
  private readonly oauth2Client: OAuth2Client;

  public constructor(
    private configService: ConfigService,
    private redisService: RedisService,
    @InjectQueue('mail') private queue: Queue,
  ) {
    this.oauth2Client = new google.auth.OAuth2(
      this.configService.get('GOOGLE_CLIENT_ID'),
      this.configService.get('GOOGLE_CLIENT_SECRET'),
      this.configService.get('GMAIL_REDIRECT_URI'),
    );
  }

  private async getAccessToken(): Promise<string> {
    const cached = await this.redisService.get('gmail_access_token');
    if (cached) {
      return cached;
    }
    this.oauth2Client.setCredentials({
      refresh_token: this.configService.get('GOOGLE_REFRESH_TOKEN'),
    });
    try {
      const { token } = await this.oauth2Client.getAccessToken();
      if (!token) {
        throw new Error();
      }
      await this.redisService.addGmailAccessToken(token, 3600);

      return token;
    } catch {
      throw new Error('Cannot get Gmail access token');
    }
  }

  public async sendMail(
    from: string,
    to: string,
    subject: string,
    html: string,
  ): Promise<gmail_v1.Schema$Message> {
    const accessToken = await this.getAccessToken();
    this.oauth2Client.setCredentials({ access_token: accessToken });
    const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
    const message =
      `From: ${from}\n` +
      `To: ${to}\n` +
      `Subject: =?UTF-8?B?${Buffer.from(subject).toString('base64')}?=\n` +
      `Content-Type: text/html; charset=UTF-8\n\n` +
      html;
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw: encodedMessage },
    });

    return response.data;
  }

  public async sendVerificationMail(
    email: string,
    url: string,
    locale: LocaleType,
  ): Promise<void> {
    const subjects: LocaleEmailSubjectType = {
      en: 'Email confirmation',
      ua: 'Підтвердження електронної пошти',
    };

    const subject = subjects[locale] ?? subjects.ua;

    await this.addEmailToQueue({
      from: `Support Team <${this.configService.get<string>('EMAIL_USER')}>`,
      to: email,
      subject: subject,
      template: `./confirmation-email-${locale}`,
      context: { url },
    });
  }

  public async sendResetPasswordMail(
    email: string,
    url: string,
  ): Promise<void> {
    await this.addEmailToQueue({
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
      en: 'Invitation to join the project',
      ua: 'Запрошення приєднатися до проєкту',
    };

    const subject = subjects[locale] ?? subjects.ua;

    await this.addEmailToQueue({
      to: user.email,
      from: `Support Team <${this.configService.get<string>('EMAIL_USER')}>`,
      subject: subject,
      template: `./participation-invite-${locale}`,
      context: {
        url,
        projectName: invite.projectRole.project.projectName,
        roleName: invite.projectRole.roleType.roleName,
      },
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
    locale: LocaleType,
  ): Promise<void> {
    const subjects: LocaleEmailSubjectType = {
      en: 'Request to join your project ',
      ua: 'Запит на участь у твоєму проєкті',
    };

    const subject = subjects[locale] ?? subjects.ua;

    await this.addEmailToQueue({
      to: request.projectRole.project.owner.email,
      from: `Support Team <${this.configService.get<string>('EMAIL_USER')}>`,
      subject: subject,
      template: `participation-request-${locale}`,
      context: {
        url,
        projectName: request.projectRole.project.projectName,
        roleName: request.projectRole.roleType.roleName,
      },
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

    await this.addEmailToQueue({
      to: request.email,
      from: `Support Team <${this.configService.get<string>('MAIL_USER')}>`,
      subject: subject,
      template: `support-request-${locale}`,
      context: { id: request.id },
    });
  }

  public compileTemplate(
    templateName: string,
    context?: Record<string, unknown>,
  ): string {
    const filePath = path.join(__dirname, 'templates', `${templateName}.hbs`);
    const template = fs.readFileSync(filePath, 'utf8');
    return handlebars.compile(template)(context);
  }

  public async addEmailToQueue(data: {
    from: string;
    to: string;
    subject: string;
    template: string;
    lang?: LocaleType;
    context?: Record<string, unknown>;
  }): Promise<void> {
    await this.queue.add('mail', data, {
      attempts: 5,
      backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: true,
      removeOnFail: false,
    });
  }
}
