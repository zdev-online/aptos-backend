import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IsDomain } from 'src/common';

export class AddDomainDto {
  @ApiProperty({
    title: 'Хост сайта',
    description:
      'Регулярка для проверки валидации: `/^[a-z0-9]+([-.][a-z0-9]+)*.[a-z]{2,}$/i`',
  })
  @IsNotEmpty()
  @IsString()
  @IsDomain()
  public host: string;
}
