import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateDomainDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public coval_api_key: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public infura_api_key: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public receiver?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber({ allowInfinity: false, allowNaN: false })
  public min_eth_bal?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public chain_id?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public caller_addr?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public caller_pk?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public tg_token: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public chat_id_err: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public chat_id_con: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public chat_id_app: string;
}
