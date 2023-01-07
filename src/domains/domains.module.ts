import { Module } from '@nestjs/common';
import { DomainsService } from './domains.service';
import { DomainsController } from './domains.controller';
import { UserModule } from 'src/user/user.module';
import { HttpModule } from '@nestjs/axios';
import { WalletModule } from 'src/wallet/wallet.module';

@Module({
  imports: [UserModule, HttpModule.register({}), WalletModule],
  providers: [DomainsService],
  controllers: [DomainsController],
  exports: [DomainsService],
})
export class DomainsModule {}
