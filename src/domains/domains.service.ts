import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common/services';
import { Prisma, SubscriptionType } from '@prisma/client';
import * as e from 'express';
import { existsSync, mkdirSync } from 'fs';
import { mkdir } from 'fs/promises';
import { PrismaService } from 'nestjs-prisma';
import { join } from 'path';
import { firstValueFrom } from 'rxjs';
import {
  BadRequestException,
  ErrorCodes,
  ForbiddenException,
  MAX_MONTH_SUB_DOMAINS,
  MAX_WORKER_SUB_DOMAINS,
} from 'src/common';
import { UsersEntity } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import {
  AddDomainDto,
  DomainResponseDto,
  IsConnectedResponseDto,
  UpdateDomainDto,
} from './dto';

@Injectable()
export class DomainsService {
  private root_path: string = join(process.cwd());
  private domains_path = join(process.cwd(), 'domains');
  private staticHandler = e.static(this.root_path);

  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
    private httpService: HttpService,
  ) {
    if (!existsSync(this.domains_path)) {
      mkdirSync(this.domains_path, { recursive: true });
    }
  }

  public async getPageOrFile(req: e.Request, res: e.Response): Promise<any> {
    const host = req.headers.host;

    const domain = await this.prismaService.domains.findUnique({
      where: { host },
      select: {
        id: true,
        owner: {
          select: {
            banned: true,
          },
        },
      },
    });

    if (!domain || domain.owner.banned) {
      res
        .status(404)
        .send(
          `<center><h1>404 Not Found</h1></center><hr><center>nginx${
            process.env.MODE == 'development' && ' from nest'
          }</center>`,
        );
      return;
    }

    return this.staticHandler(req, res, () =>
      res
        .status(404)
        .send(
          `<center><h1>404 Not Found</h1></center><hr><center>nginx${
            process.env.MODE == 'development' && ' from nest'
          }</center>`,
        ),
    );
  }

  /** Проверить подключен ли домен к нашему IP */
  public isConnected(
    host: string,
    path: string,
    domain: string,
  ): IsConnectedResponseDto {
    return { host, path, is_connected: host == domain };
  }

  public async logToTelegramChat(host: string, message: string) {
    const domain = await this.findByHost(host);
    if (!domain) {
      throw new BadRequestException(
        { message: 'Domain not found' },
        ErrorCodes.DomainNotFound,
      );
    }

    const endpoint = new URL(
      `/bot${domain.tg_token}/sendMessage`,
      'https://api.telegram.org',
    );

    // TODO: endpoint.searchParams.append('chat_id', '');
    endpoint.searchParams.append(
      'text',
      encodeURIComponent(message.replace('<br>', '\n')),
    );
    endpoint.searchParams.append('parse_mode', 'HTML');

    firstValueFrom(this.httpService.post(endpoint.toString()))
      .then(() => Logger.log(`Лог отправлен в чат.`, `${host}-logs`))
      .catch((error) =>
        Logger.error(`Ошибка отправки лога: ${error.message}`, `${host}-logs`),
      );
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
      this.createFolder(dto.host),
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
      delete dto.receiver;
      delete dto.min_eth_bal;
      delete dto.chain_id;
      delete dto.caller_addr;
      delete dto.caller_pk;
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

  /** Создать папку домена */
  private createFolder(folder_name: string) {
    return mkdir(join(this.domains_path, folder_name), { recursive: true });
  }
}
