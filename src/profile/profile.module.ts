import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { UserModule } from 'src/user/user.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { DomainsModule } from 'src/domains/domains.module';

@Module({
  imports: [UserModule, MailerModule, DomainsModule],
  providers: [ProfileService],
  controllers: [ProfileController],
})
export class ProfileModule {}
