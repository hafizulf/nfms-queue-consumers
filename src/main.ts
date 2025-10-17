import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  const configService = app.get(ConfigService);
  const appPort = configService.get('APP_PORT');

  await app.listen(appPort);

  console.log('Application is running on port', appPort);
}
bootstrap();
