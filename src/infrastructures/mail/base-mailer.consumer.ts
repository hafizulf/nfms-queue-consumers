import { Logger } from '@nestjs/common';
import { Nack } from '@golevelup/nestjs-rabbitmq';
import { MailerHelper } from './mailer.helper';
import { emailNotification } from './mail.template';
import { EmailPurpose, MessageRegisterEmail } from './mailer.dto';

export abstract class BaseMailerConsumer {
  protected readonly logger: Logger;

  protected constructor(
    protected readonly mailHelper: MailerHelper,
    ctxName: string,
  ) {
    this.logger = new Logger(ctxName);
  }

  protected parsePayload(msg: unknown): MessageRegisterEmail | null {
    const raw = Buffer.isBuffer(msg) ? safeJson(msg.toString()) : (msg as any);

    if (!raw?.email || !raw?.verifyUrl) {
      this.logger.warn(`invalid payload: ${JSON.stringify(raw)}`);
      return null;
    }
    return raw as MessageRegisterEmail;
  }

  protected buildTemplate(subject: string, text: string) {
    return emailNotification(subject, text);
  }

  protected async process(msg: unknown, purpose: EmailPurpose): Promise<void | Nack> {
    const payload = this.parsePayload(msg);
    if (!payload) return new Nack(false); // DLQ

    try {
      const { subject, body } = this.buildTemplate(payload.purpose, payload.verifyUrl);

      await this.mailHelper.sendEmail({
        mailTo: payload.email,
        mailSubject: subject,
        mailBody: body,
        type: purpose,
      });

      return;
    } catch (e: any) {
      this.logger.error(`send failed: ${e?.message ?? e}`, e?.stack);
      return new Nack(false); // DLQ
    }
  }
}

function safeJson(s: string) {
  try { return JSON.parse(s); } catch { return s; }
}
