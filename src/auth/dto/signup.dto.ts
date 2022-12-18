import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsString,
} from 'class-validator';
import { Match, MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from 'src/common';

export class SignUpDto {
  @ApiProperty({ title: 'E-Mail пользователя' })
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @ApiProperty({ title: 'Пароль пользователя' })
  @IsNotEmpty()
  @IsString()
  @MinLength(MIN_PASSWORD_LENGTH)
  @MaxLength(MAX_PASSWORD_LENGTH)
  public password: string;

  @ApiProperty({
    title: 'Подтверждение пароля',
    description: 'Должен совпадать с `password` полем',
  })
  @IsNotEmpty()
  @IsString()
  @Match('password')
  public confirm_password: string;

  @ApiProperty({
    title: 'Токен Google Captcha',
  })
  @IsNotEmpty()
  @IsString()
  public recaptcha: string;
}
