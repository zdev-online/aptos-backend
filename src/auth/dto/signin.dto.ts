import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsString,
} from 'class-validator';
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from 'src/common';

export class SignInDto {
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
    title: 'Токен Google Captcha',
  })
  @IsNotEmpty()
  @IsString()
  public recaptcha: string;
}
