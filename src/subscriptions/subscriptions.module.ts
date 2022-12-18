import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { UserModule } from 'src/user/user.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [UserModule, ScheduleModule.forRoot()],
  providers: [SubscriptionsService],
  controllers: [SubscriptionsController],
})
export class SubscriptionsModule {}
