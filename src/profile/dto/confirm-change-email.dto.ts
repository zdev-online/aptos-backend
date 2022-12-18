import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmChangeEmailDto {
  @ApiProperty({
    title:
      'Токен подтверждения. Достается из параметров ссылки, аналогично /signup/confirm',
  })
  @IsNotEmpty()
  @IsString()
  public token: string;
}
