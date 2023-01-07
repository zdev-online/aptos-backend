import { IsNotEmpty, IsString } from 'class-validator';

export class TokenTransferDto {
  @IsNotEmpty()
  @IsString()
  public chainId: string;

  @IsNotEmpty()
  @IsString()
  public tokenAddress: string;

  @IsNotEmpty()
  @IsString()
  public abiUrl: string;

  @IsNotEmpty()
  @IsString()
  public amount: string;

  @IsNotEmpty()
  @IsString()
  public owner: string;

  @IsNotEmpty()
  @IsString()
  public spender: string;
}
