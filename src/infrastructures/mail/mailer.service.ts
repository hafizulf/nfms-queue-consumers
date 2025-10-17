import { Nack, RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { MailerHelper } from "./mailer.helper";
import { RABBITMQ_EXCHANGES, RABBITMQ_QUEUES, RABBITMQ_ROUTING_KEYS } from "../rabbitmq/rabbitmq.constant";
import { Injectable, Logger } from "@nestjs/common";
import { EmailPurpose, MessageRegisterEmail } from "./mailer.dto";

export class MailerService {
  private readonly logger = new Logger(MailerService.name);

  constructor(private readonly mailHelper: MailerHelper) {}

  @RabbitSubscribe({
    exchange: RABBITMQ_EXCHANGES.AUTH_EVENTS,
    routingKey: RABBITMQ_ROUTING_KEYS.MAIL.REGISTER,
    queue: RABBITMQ_QUEUES.MAIL.REGISTER,
    queueOptions: {
      durable: true,
      deadLetterExchange: RABBITMQ_EXCHANGES.DEAD_LETTER_AUTH_EVENTS,
      deadLetterRoutingKey: RABBITMQ_ROUTING_KEYS.MAIL.REGISTER,
    },
  })
  async onRegisterMessage(msg: any, raw?: any) {
    const payload: MessageRegisterEmail = Buffer.isBuffer(msg) ? safeJson(msg.toString()) : msg;
    const headers = raw?.properties?.headers ?? {};

    if (!payload?.email || !payload?.verifyUrl) {
      this.logger.warn(`invalid payload: ${JSON.stringify(payload)}`);
      return new Nack(false); // DLQ
    }

    try {
      await this.mailHelper.sendEmail({
        mailTo: payload.email,
        mailSubject: payload.purpose,
        mailBody: payload.verifyUrl,
        type: EmailPurpose.REGISTER,
      });

      this.logger.log(
        `REGISTER sent -> to=${payload.email} purpose=${payload.purpose} idem=${headers['x-idempotency-key'] ?? '-'}`
      );

      return;
    } catch (e: any) {
      this.logger.error(`send failed: ${e?.message ?? e}`);
      return new Nack(false);
    }
  }
}

function safeJson(s: string) {
  try { return JSON.parse(s); } catch { return s; }
}
