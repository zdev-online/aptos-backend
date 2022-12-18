import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { CrystalPayModule } from 'src/crystal-pay/crystal-pay.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [CrystalPayModule, UserModule],
  providers: [PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
