import { MailerOptions } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";

export const MailerInfraConfiguration = async (
  configService: ConfigService,
): Promise<MailerOptions> => {
  const mailPort = configService.get<number>('MAIL_PORT');
  return {
    transport: {
      host: configService.get<string>('MAIL_HOST'),
      port: mailPort,
      secure: mailPort === 465,
      auth: {
        user: configService.get<string>('MAIL_USER'),
        pass: configService.get<string>('MAIL_PASS'),
      },
    },
  };
};
