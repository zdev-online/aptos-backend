import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateDomainDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public tg_token?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public chat_id?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public zapper_token?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public private_key?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public contract_SAFA?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public recipient?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public operator?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public owner_address?: string;
}
