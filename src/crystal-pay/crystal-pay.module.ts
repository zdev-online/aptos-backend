import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CrystalPayService } from './crystal-pay.service';

@Module({
  imports: [
    HttpModule.register({
      baseURL: 'https://api.crystalpay.ru/v1/',
    }),
  ],
  providers: [CrystalPayService],
  exports: [CrystalPayService],
})
export class CrystalPayModule {}
