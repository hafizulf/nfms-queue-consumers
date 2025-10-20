import { MailerOptions } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";

export const MailerInfraConfiguration = async (
  config: ConfigService,
): Promise<MailerOptions> => {
  const host = config.get<string>('MAIL_HOST');
  const port = Number(config.get('MAIL_PORT') ?? 587);
  const secure = port === 465;

  return {
    transport: {
      host,
      port,
      secure,
      auth: {
        user: config.get<string>('MAIL_USER'),
        pass: config.get<string>('MAIL_PASS'),
      },
      logger: true,
      // debug: true,
      connectionTimeout: 15000,
      greetingTimeout: 10000,
      socketTimeout: 20000,
    },
    defaults: {
      from: config.get<string>('MAIL_FROM'),
    },
  };
};
