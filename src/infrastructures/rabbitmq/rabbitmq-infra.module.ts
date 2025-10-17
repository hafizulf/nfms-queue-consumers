import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq";
import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RabbitMqConfiguration } from "src/infrastructures/rabbitmq/rabbitmq.config";
import { RabbitMQConnectionLogger } from "./rabbitmq-connection.logger";

@Global()
@Module({
  imports: [
    RabbitMQModule.forRootAsync({
      inject: [ConfigService],
      useFactory: RabbitMqConfiguration,
    }),
  ],
  providers: [RabbitMQConnectionLogger],
  exports: [RabbitMQModule],
})
export class RabbitMQInfraModule {}
