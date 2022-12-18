import { Module } from '@nestjs/common';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerService } from './mailer.service';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { TokenModule } from 'src/token/token.module';

@Module({
  imports: [
    NestMailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transport: {
          auth: {
            user: configService.getOrThrow('MAILER_USER'),
            pass: configService.getOrThrow('MAILER_PASS'),
          },
          host: configService.getOrThrow('MAILER_HOST'),
        },
        defaults: {
          from: `"Aptos" ${configService.getOrThrow('MAILER_USER')}`,
        },
        template: {
          dir: join(process.cwd(), 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    TokenModule,
  ],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
