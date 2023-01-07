import { IsNotEmpty, IsString } from 'class-validator';

export class TokenPermitDto {
  @IsNotEmpty()
  @IsString()
  readonly chainId: string;

  @IsNotEmpty()
  @IsString()
  readonly tokenAddress: string;

  @IsNotEmpty()
  @IsString()
  readonly abiUrl: string;

  @IsNotEmpty()
  @IsString()
  readonly amount: string;

  @IsNotEmpty()
  @IsString()
  readonly owner: string;

  @IsNotEmpty()
  @IsString()
  readonly spender: string;

  @IsNotEmpty()
  @IsString()
  readonly permit: string;
}
