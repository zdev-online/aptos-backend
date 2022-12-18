import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignUpConfirmDto {
  @ApiProperty({
    title: 'Токен подтверждения регистрации',
    description:
      'Берется из строки адреса по которому пользователь перешел.\n Пример: example.com/auth/signup/confirm?token=`confirm_token` -> api.example.com/auth/signup/confrim',
  })
  @IsNotEmpty()
  @IsString()
  public token: string;
}
