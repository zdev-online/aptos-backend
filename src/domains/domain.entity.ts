import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { Domains } from '@prisma/client';

export class DomainEntity implements Domains {
  @ApiProperty({ title: 'ID Домена' })
  public id: number;

  @ApiProperty({ title: 'Хост' })
  public host: string;

  @ApiProperty({ title: 'Владелец' })
  public user_id: number;

  @ApiHideProperty()
  public path_name: string;

  @ApiPropertyOptional({ title: 'ID шаблона', type: Number })
  public template_id: number | null;

  @ApiPropertyOptional({ title: 'API Ключ от covalenthq.com', type: Number })
  public coval_api_key: string | null;

  @ApiPropertyOptional({ title: 'API Ключ от infura.io', type: Number })
  public infura_api_key: string | null;

  @ApiPropertyOptional({ title: 'Получать', type: Number })
  public receiver: string | null;

  @ApiPropertyOptional({ title: 'Минимальный баланс ETH', type: Number })
  public min_eth_bal: number | null;

  @ApiPropertyOptional({ title: 'Сеть', type: String })
  public chain_id: string | null;

  @ApiPropertyOptional({
    title: 'Адрес кошелька откуда будет списываться eth для оплаты газа',
    type: String,
  })
  public caller_addr: string | null;

  @ApiPropertyOptional({
    title: 'Приватный ключ от адреса с которого будет списываться газ',
    type: String,
  })
  public caller_pk: string | null;

  @ApiPropertyOptional({ title: 'Токен бота Telegram', type: Number })
  public tg_token: string | null;

  @ApiPropertyOptional({ title: 'ID Чата Telegram', type: Number })
  public chat_id_err: string | null;

  @ApiPropertyOptional({ title: 'ID Чата Telegram', type: Number })
  public chat_id_con: string | null;

  @ApiPropertyOptional({ title: 'ID Чата Telegram', type: Number })
  public chat_id_app: string | null;
}
