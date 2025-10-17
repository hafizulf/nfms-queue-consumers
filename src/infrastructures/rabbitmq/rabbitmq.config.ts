import { RabbitMQConfig } from '@golevelup/nestjs-rabbitmq';
import {
  RABBITMQ_EXCHANGES, RABBITMQ_EXCHANGE_TYPE,
  RABBITMQ_QUEUES, RABBITMQ_ROUTING_KEYS,
} from './rabbitmq.constant';
import { ConfigService } from '@nestjs/config';

export const RabbitMqConfiguration = async (
  configService: ConfigService,
): Promise<RabbitMQConfig> => ({
  uri: configService.get<string>('RABBITMQ_URI'),
  connectionInitOptions: { wait: true, timeout: 10_000 },
  exchanges: [
    { name: RABBITMQ_EXCHANGES.AUTH_EVENTS, type: RABBITMQ_EXCHANGE_TYPE.TOPIC },
    { name: RABBITMQ_EXCHANGES.DEAD_LETTER_AUTH_EVENTS, type: RABBITMQ_EXCHANGE_TYPE.TOPIC },
  ],
  queues: [
    {
      name: RABBITMQ_QUEUES.MAIL.REGISTER,
      exchange: RABBITMQ_EXCHANGES.AUTH_EVENTS,
      routingKey: RABBITMQ_ROUTING_KEYS.MAIL.REGISTER,
      options: {
        durable: true,
        deadLetterExchange: RABBITMQ_EXCHANGES.DEAD_LETTER_AUTH_EVENTS,
        deadLetterRoutingKey: RABBITMQ_ROUTING_KEYS.MAIL.REGISTER,
      },
    },
    {
      name: RABBITMQ_QUEUES.MAIL.FORGOT_PASSWORD,
      exchange: RABBITMQ_EXCHANGES.AUTH_EVENTS,
      routingKey: RABBITMQ_ROUTING_KEYS.MAIL.FORGOT_PASSWORD,
      options: {
        durable: true,
        deadLetterExchange: RABBITMQ_EXCHANGES.DEAD_LETTER_AUTH_EVENTS,
        deadLetterRoutingKey: RABBITMQ_ROUTING_KEYS.MAIL.FORGOT_PASSWORD,
      },
    },
    {
      name: RABBITMQ_QUEUES.MAIL._DLQ.REGISTER,
      exchange: RABBITMQ_EXCHANGES.DEAD_LETTER_AUTH_EVENTS,
      routingKey: RABBITMQ_ROUTING_KEYS.MAIL.REGISTER,
      options: { durable: true },
    },
    {
      name: RABBITMQ_QUEUES.MAIL._DLQ.FORGOT_PASSWORD,
      exchange: RABBITMQ_EXCHANGES.DEAD_LETTER_AUTH_EVENTS,
      routingKey: RABBITMQ_ROUTING_KEYS.MAIL.FORGOT_PASSWORD,
      options: { durable: true },
    },
  ],
});
