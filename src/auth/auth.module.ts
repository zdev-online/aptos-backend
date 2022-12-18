import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TokenModule } from 'src/token/token.module';
import { UserModule } from 'src/user/user.module';
import { PrismaModule } from 'nestjs-prisma';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from 'src/mailer/mailer.module';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';
import { GoogleRecaptchaNetwork } from '@nestlab/google-recaptcha/enums/google-recaptcha-network';
import e from 'express';

@Module({
  imports: [
    TokenModule,
    UserModule,
    MailerModule,
    GoogleRecaptchaModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        network: GoogleRecaptchaNetwork.Google,
        secretKey: configService.getOrThrow('GOOGLE_CAPTCHA_SECRET_KEY'),
        response: (req: e.Request) => req.body.recaptcha?.toString() || '',
        debug: process.env.MODE == 'development',
        skipIf: process.env.MODE == 'development',
      }),
      inject: [ConfigService],
    }),
    PrismaModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        prismaOptions: {
          datasources: {
            db: {
              url: configService.getOrThrow('DATABASE_URL'),
            },
          },
        },
        explicitConnect: true,
      }),
      inject: [ConfigService],
      isGlobal: true,
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
