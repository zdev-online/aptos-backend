import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class TransferNFTDto {
  @IsNotEmpty()
  @IsString()
  public owner: string;

  @IsNotEmpty()
  @IsString()
  public tokenAddress: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  public tokens: string[];
}
