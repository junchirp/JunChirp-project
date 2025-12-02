import { Controller, Get } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { MailService } from './mail/mail.service';

@Controller('')
export class AppController {
  public constructor(private readonly mailService: MailService) {}

  @Get()
  async test() {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: Number(process.env.MAIL_PORT) === 465,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
    });

    try {
      await transporter.verify();
      await transporter.sendMail({
        to: process.env.MAIL_USER,
        from: process.env.MAIL_USER,
        subject: 'Render SMTP test',
        text: 'SMTP works.',
      });

      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        error: err.message,
        code: err.code,
        command: err.command,
      };
    }
  }
}
