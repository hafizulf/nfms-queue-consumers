import { RabbitMQConfig } from "@golevelup/nestjs-rabbitmq";
import { ConfigService } from "@nestjs/config";
import { RABBITMQ_EXCHANGE_TYPE, RABBITMQ_EXCHANGES, RABBITMQ_QUEUES, RABBITMQ_ROUTING_KEYS } from "src/infrastructures/rabbitmq/rabbitmq.constant";

export const RabbitMqConfiguration = async (
  configService: ConfigService,
): Promise<RabbitMQConfig> => {
  return {
    uri: configService.get<string>('RABBITMQ_URI'),
    connectionInitOptions: { wait: true, timeout: 10000 },
    exchanges: [
      {
        name: RABBITMQ_EXCHANGES.AUTH_EVENTS,
        type: RABBITMQ_EXCHANGE_TYPE.TOPIC,
      },
    ],
    queues: [
      {
        name: RABBITMQ_QUEUES.MAIL.REGISTER,
        routingKey: RABBITMQ_ROUTING_KEYS.MAIL.REGISTER,
        exchange: RABBITMQ_EXCHANGES.AUTH_EVENTS,
      },
      {
        name: RABBITMQ_QUEUES.MAIL.FORGOT_PASSWORD,
        routingKey: RABBITMQ_ROUTING_KEYS.MAIL.FORGOT_PASSWORD,
        exchange: RABBITMQ_EXCHANGES.AUTH_EVENTS,
      },
    ],
  };
};
