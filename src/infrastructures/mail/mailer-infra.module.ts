import { Global, Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";
import { MailerInfraConfiguration } from "./mail.config";
import { MailerConsumer } from "./mailer.consumer";
import { MailerHelper } from "./mailer.helper";

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: MailerInfraConfiguration,
    }),
  ],
  providers: [MailerConsumer, MailerHelper],
  exports: [MailerInfraModule],
})
export class MailerInfraModule {}
