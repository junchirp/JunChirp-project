import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailService } from '../mail.service';

@Processor('mail')
export class MailProcessor {
  public constructor(private mailService: MailService) {}

  @Process('mail')
  public async handleSendEmail(
    job: Job<{
      from: string;
      to: string;
      subject: string;
      template: string;
      context?: Record<string, unknown>;
    }>,
  ): Promise<void> {
    const { from, to, subject, template, context } = job.data;
    const html = this.mailService.compileTemplate(template, context);
    await this.mailService.sendMail(from, to, subject, html);
  }
}
