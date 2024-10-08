import { Roles, Users } from '@prisma/client';
import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { DomainEntity } from 'src/domains/domain.entity';
import { SubscriptionEntity } from 'src/subscriptions/subcription.entity';

export class UsersEntity implements Users {
  @ApiProperty({ title: 'ID Пользователя' })
  public id: number;

  @ApiPropertyOptional({
    title: 'E-Mail Пользователя',
    description: 'Не возвращается только в 1 случае: Получение чужого аккаунта',
  })
  public email: string;

  @ApiPropertyOptional({
    title: 'Статус подтверждения почты',
    description:
      '`true` - подтвержден, `false` - нет. Не возвращается только в 1 случае: Получение чужого аккаунта',
  })
  public email_confirmed: boolean;

  @ApiPropertyOptional({
    title: 'Баланс пользователя',
    description: 'Не возвращается только в 1 случае: Получение чужого аккаунта',
  })
  public balance: number;

  @ApiProperty({ title: 'Роль пользователя', enum: Roles })
  public role: Roles;

  @ApiProperty({ title: 'Дата создания аккаунта' })
  public created_at: Date;

  @ApiProperty({ title: 'Последнее обновление в базе' })
  public updated_at: Date;

  @ApiHideProperty()
  public password: string;

  @ApiPropertyOptional({
    title: 'Домены пользователя',
    type: () => [DomainEntity],
    description: 'Не возвращается только в 1 случае: Получение чужого аккаунта',
  })
  public domains: DomainEntity[];

  @ApiPropertyOptional({
    title: 'Подписка пользователя',
    type: () => SubscriptionEntity,
    description: 'Не возвращается только в 1 случае: Получение чужого аккаунта',
  })
  public subscription?: SubscriptionEntity | null;

  @ApiProperty({
    description: 'Забанен пользователь или нет',
  })
  public banned: boolean;
}
