import { Module } from '@nestjs/common';
import { DomainsService } from './domains.service';
import { DomainsController } from './domains.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  providers: [DomainsService],
  controllers: [DomainsController],
  exports: [DomainsService],
})
export class DomainsModule {}
