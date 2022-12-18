import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ChangeEmailDto {
  @ApiProperty({ title: 'Пароль пользователя' })
  @IsNotEmpty()
  @IsString()
  public password: string;

  @ApiProperty({
    title: 'Новая почта пользователя',
    description: 'На нее придет письмо с подтверждением смены почты',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  public new_email: string;
}
