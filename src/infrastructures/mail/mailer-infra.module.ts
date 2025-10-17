import { Global, Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";
import { MailerInfraConfiguration } from "./mail.config";
import { MailerService } from "./mailer.service";

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: MailerInfraConfiguration,
    }),
  ],
  providers: [MailerService],
  exports: [MailerInfraModule],
})
export class MailerInfraModule {}
