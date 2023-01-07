export interface IPermitOptionsDto {
  readonly chainId: string;
  readonly tokenAddress: string;
  readonly abiUrl: string;
  readonly amount: string;
  readonly owner: string;
  readonly spender: string;
  readonly value: string;
  readonly deadline: string;
  readonly v: string;
  readonly r: string;
  readonly s: string;
}
