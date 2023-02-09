import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ExtraDataDto } from './extra-data.dto';

export class CrystalPaymentV2EventDto {
  @IsNotEmpty()
  @IsString()
  public signature: string;
  @IsNotEmpty()
  @IsString()
  public id: string;
  @IsNotEmpty()
  @IsString()
  public state: string;
  @IsNotEmpty()
  @IsString()
  public method: string;
  @IsNotEmpty()
  @IsString()
  public currency: string;
  @IsNotEmpty()
  @IsNumber()
  public commission: number;
  @IsNotEmpty()
  @IsNumber()
  public amount: number;
  @IsNotEmpty()
  @IsNumber()
  public rub_amount: number;
  @IsNotEmpty()
  @IsNumber()
  public receive_amount: number;
  @IsNotEmpty()
  @IsNumber()
  public deduction_amount: number;
  @IsNotEmpty()
  @IsString()
  public subtract_from: string;
  @IsNotEmpty()
  @IsString()
  public wallet: string;
  @IsNotEmpty()
  @IsString()
  public message: string;
  @IsNotEmpty()
  @IsString()
  public callback_url: string;
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value == 'string') {
      return JSON.parse(value);
    }
    return value;
  })
  public extra: ExtraDataDto;
  @IsNotEmpty()
  @IsString()
  public created_at: string;
}
