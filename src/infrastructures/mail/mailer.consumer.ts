import { Nack, RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { MailerHelper } from "./mailer.helper";
import { RABBITMQ_EXCHANGES, RABBITMQ_QUEUES, RABBITMQ_ROUTING_KEYS } from "../rabbitmq/rabbitmq.constant";
import { Injectable } from "@nestjs/common";
import { EmailPurpose } from "./mailer.dto";
import { BaseMailerConsumer } from "./base-mailer.consumer";
import { MailerService } from "@nestjs-modules/mailer";


@Injectable()
export class MailerConsumer extends BaseMailerConsumer {
  constructor(mailHelper: MailerHelper) {
    super(mailHelper, MailerService.name);
  }

  private static buildQueueOptions(dlx: string, dlrk: string) {
    return {
      durable: true,
      deadLetterExchange: dlx,
      deadLetterRoutingKey: dlrk,
    } as const;
  }

  @RabbitSubscribe({
    exchange: RABBITMQ_EXCHANGES.AUTH_EVENTS,
    routingKey: RABBITMQ_ROUTING_KEYS.MAIL.REGISTER,
    queue: RABBITMQ_QUEUES.MAIL.REGISTER,
    queueOptions: MailerConsumer.buildQueueOptions(
      RABBITMQ_EXCHANGES.DEAD_LETTER_AUTH_EVENTS,
      RABBITMQ_ROUTING_KEYS.MAIL.REGISTER,
    ),
  })
  async onRegisterMessage(msg: unknown): Promise<void | Nack> {
    return this.process(msg, EmailPurpose.REGISTER);
  }

  @RabbitSubscribe({
    exchange: RABBITMQ_EXCHANGES.AUTH_EVENTS,
    routingKey: RABBITMQ_ROUTING_KEYS.MAIL.FORGOT_PASSWORD,
    queue: RABBITMQ_QUEUES.MAIL.FORGOT_PASSWORD,
    queueOptions: MailerConsumer.buildQueueOptions(
      RABBITMQ_EXCHANGES.DEAD_LETTER_AUTH_EVENTS,
      RABBITMQ_ROUTING_KEYS.MAIL.FORGOT_PASSWORD,
    ),
  })
  async onForgotPasswordMessage(msg: unknown): Promise<void | Nack> {
    return this.process(msg, EmailPurpose.FORGOT_PASSWORD);
  }
}
