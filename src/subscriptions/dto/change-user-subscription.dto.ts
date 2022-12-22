import { SubscriptionType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ChangeUserSubscritptionDto {
  @IsNotEmpty()
  @IsNumber({ allowInfinity: false, allowNaN: false })
  public user_id: number;

  @IsNotEmpty()
  @IsString()
  @IsEnum(SubscriptionType)
  public type: SubscriptionType;
}
