import { ApiProperty } from '@nestjs/swagger';
import { Subscriptions, SubscriptionType } from '@prisma/client';

export class SubscriptionEntity implements Subscriptions {
  @ApiProperty()
  public id: number;
  @ApiProperty()
  public user_id: number;
  @ApiProperty({ enum: Object.keys(SubscriptionType) })
  public type: SubscriptionType;
  @ApiProperty()
  public expires_in: Date | null;
  @ApiProperty()
  public created_at: Date;
}
