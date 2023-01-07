import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';

@Module({
  imports: [HttpModule.register({})],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
