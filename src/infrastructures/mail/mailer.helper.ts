import { Injectable, Logger } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { SendEmailPayload } from "./mailer.dto";
import { SentMessageInfo } from 'nodemailer';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MailerHelper {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  async sendEmail(
    payload: SendEmailPayload,
  ): Promise<SentMessageInfo> {
    const { mailTo, mailSubject, mailBody, type, options } = payload;

    const mailOptions = {
      from: this.configService.get<string>('MAIL_FROM'),
      to: mailTo,
      subject: mailSubject,
      html: mailBody,
      ...options,
    };

    try {
      const responseMailTransporter = await this.mailerService.sendMail(mailOptions);
      delete mailOptions.html;
      const string = JSON.stringify(mailOptions);

      Logger.log(
        `Success send mail. Type: ${type}. ${string}`,
        'EmailNotification',
      );

      return responseMailTransporter;
    } catch (err) {
      delete mailOptions.html;
      const string = JSON.stringify(mailOptions);
      const errors = JSON.stringify(err);

      Logger.error(
        `Error send email. Type: ${type}. ${string},  Error: ${errors}`,
        'EmailNotification',
      );

      return false;
    }
  }
}
