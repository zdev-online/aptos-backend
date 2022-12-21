import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class GetUsersListDto {
  @ApiPropertyOptional({ title: 'Какая страница' })
  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }) => +value)
  @IsNumber()
  public page: number;

  @ApiPropertyOptional({ title: 'Сколько пользователей вернеться' })
  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }) => +value)
  @IsNumber()
  public take: number;
}
