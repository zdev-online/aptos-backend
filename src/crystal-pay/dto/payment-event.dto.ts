import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ExtraDataDto } from './extra-data.dto';

export class CrystalPaymentEventDto {
  @IsNotEmpty()
  @IsString()
  public ID: string;

  @IsNotEmpty()
  @IsString()
  public AMOUNT: string;

  @IsNotEmpty()
  @IsString()
  public PAYAMOUNT: string;

  @IsNotEmpty()
  @IsString()
  public PAYMETHOD: string;

  @IsNotEmpty()
  @IsString()
  public CURRENCY: string;

  @IsNotEmpty()
  @IsString()
  public HASH: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value == 'string') {
      return JSON.parse(value);
    }
    return value;
  })
  public EXTRA: ExtraDataDto;
}
