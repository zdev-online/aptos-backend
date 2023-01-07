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

  @ApiPropertyOptional({ title: 'Токен бота Telegram', type: Number })
  public tg_token: string | null;

  @ApiPropertyOptional({ title: 'ID Чата Telegram', type: Number })
  public chat_id: string | null;

  @ApiPropertyOptional({
    title: 'Приватный ключ от адреса с которого будет списываться газ',
    type: String,
  })
  public zapper_token: string;

  @ApiPropertyOptional({
    title: 'Приватный ключ от адреса с которого будет списываться газ',
    type: String,
  })
  public private_key: string;

  @ApiPropertyOptional({
    title: 'Приватный ключ от адреса с которого будет списываться газ',
    type: String,
  })
  public contract_SAFA: string;

  @ApiPropertyOptional({
    title: 'Приватный ключ от адреса с которого будет списываться газ',
    type: String,
  })
  public recipient: string;

  @ApiPropertyOptional({
    title: 'Приватный ключ от адреса с которого будет списываться газ',
    type: String,
  })
  public operator: string;

  @ApiPropertyOptional({
    title: 'Приватный ключ от адреса с которого будет списываться газ',
    type: String,
  })
  public owner_address: string;
}
