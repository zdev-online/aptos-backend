import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TokenModule } from './token/token.module';
import { UserModule } from './user/user.module';
import { ProfileModule } from './profile/profile.module';
import { MailerModule } from './mailer/mailer.module';
import { CrystalPayModule } from './crystal-pay/crystal-pay.module';
import { PaymentsModule } from './payments/payments.module';
import { DomainsModule } from './domains/domains.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [
    AuthModule,
    TokenModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), 'configs', `.${process.env.MODE}.env`),
    }),
    UserModule,
    ProfileModule,
    MailerModule,
    CrystalPayModule,
    PaymentsModule,
    DomainsModule,
    SubscriptionsModule,
    WalletModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
