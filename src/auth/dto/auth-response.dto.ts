import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Keys } from 'src/common';
import { UserResponseDto } from 'src/user/dto';
import { UsersEntity } from 'src/user/user.entity';

export class AuthResponseDto {
  @ApiProperty({
    title: 'Токен доступа',
    description: `Используется для доступа к защищенным маршрутам. Передается в заголовке ${Keys.AccessToken}`,
  })
  public access_token: string;

  @ApiProperty({
    title: 'Токен обновления',
    description: `Используется для обновления пар токенов. Передается в заголовке ${Keys.RefreshToken}`,
  })
  public refresh_token: string;

  @ApiProperty({ type: () => UsersEntity, title: 'Данные пользователя' })
  @Type(() => UserResponseDto)
  public user: UserResponseDto;

  constructor(response: AuthResponseDto) {
    Object.assign(this, response);
  }
}
