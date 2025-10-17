import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { AmqpConnectionManager } from 'amqp-connection-manager';
import { RABBITMQ_EXCHANGES } from './rabbitmq.constant';

@Injectable()
export class RabbitMQConnectionLogger implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMQConnectionLogger.name);
  private managedConnection?: AmqpConnectionManager;

  constructor(private readonly amqpConnection: AmqpConnection) {}

  private onConnect = ({ connection, url }: { connection: { url: string }; url: string }) => {
    this.logger.log(`Connected to RabbitMQ at ${url}`);
  };

  private onDisconnect = ({ err }: { err?: Error }) => {
    this.logger.warn(`Disconnected from RabbitMQ: ${err?.message ?? 'No error details'}`);
  };

  private onConnectFailed = ({ err, url }: { err: Error; url: string }) => {
    this.logger.error(`Failed to connect to RabbitMQ at ${url}`, err?.stack);
  };

  private onBlocked = ({ reason }: { reason: string }) => {
    this.logger.warn(`RabbitMQ connection blocked: ${reason}`);
  };

  private onUnblocked = () => {
    this.logger.log('RabbitMQ connection unblocked');
  };

  onModuleInit() {
    this.managedConnection = this.amqpConnection.managedConnection 
      ?? (this.amqpConnection as any).connectionManager;

    if (!this.managedConnection) {
      this.logger.error('AMQP connection manager not available.');
      return;
    }

    this.managedConnection.on('connect', this.onConnect);
    this.managedConnection.on('disconnect', this.onDisconnect);
    this.managedConnection.on('connectFailed', this.onConnectFailed);
    this.managedConnection.on('blocked', this.onBlocked);
    this.managedConnection.on('unblocked', this.onUnblocked);

    if (this.managedConnection.isConnected?.()) {
      this.logger.log('Connected to RabbitMQ (startup)');
    }

    this.amqpConnection
      .publish(RABBITMQ_EXCHANGES.AUTH_EVENTS, 'health.ping', { t: Date.now() }, { persistent: false })
      .then(() => this.logger.log('RabbitMQ publish OK (health.ping)'))
      .catch((e: Error) => this.logger.error(`RabbitMQ publish failed: ${e?.message ?? e}`));
  }

  onModuleDestroy() {
    if (this.managedConnection) {
      this.managedConnection.removeListener('connect', this.onConnect);
      this.managedConnection.removeListener('disconnect', this.onDisconnect);
      this.managedConnection.removeListener('connectFailed', this.onConnectFailed);
      this.managedConnection.removeListener('blocked', this.onBlocked);
      this.managedConnection.removeListener('unblocked', this.onUnblocked);
    }
  }
}
