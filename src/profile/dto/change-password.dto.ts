import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';
import { MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH, Match } from 'src/common';

export class ChangePasswordDto {
  @ApiProperty({ title: 'Старый пароль пользователя' })
  @IsNotEmpty()
  @IsString()
  @MinLength(MIN_PASSWORD_LENGTH)
  @MaxLength(MAX_PASSWORD_LENGTH)
  public old_password: string;

  @ApiProperty({ title: 'Новый пароль пользователя' })
  @IsNotEmpty()
  @IsString()
  @MinLength(MIN_PASSWORD_LENGTH)
  @MaxLength(MAX_PASSWORD_LENGTH)
  public password: string;

  @ApiProperty({
    title: 'Подтверждение нового пароля пользователя',
    description: 'Должен совпадать с `password`',
  })
  @IsNotEmpty()
  @IsString()
  @Match('password')
  public confirm_password: string;
}
