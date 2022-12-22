import { ApiProperty } from '@nestjs/swagger';
import { Subscriptions, SubscriptionType } from '@prisma/client';

export class SubscriptionEntity implements Subscriptions {
  @ApiProperty()
  public id: number;

  @ApiProperty({ title: 'ID Пользователя' })
  public user_id: number;

  @ApiProperty({ enum: Object.keys(SubscriptionType), title: 'Тип подписки' })
  public type: SubscriptionType;

  @ApiProperty({
    nullable: true,
    type: Date,
    title: 'Когда заканчивается подписка.',
    description: '`null` - если подписка беконечная`',
  })
  public expires_in: Date | null;

  @ApiProperty()
  public created_at: Date;
}
