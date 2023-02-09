import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import * as crypto from 'crypto';
import { ExtraDataDto, CrystalPaymentEventDto } from './dto';

@Injectable()
export class CrystalPayService {
  private CRYSTAL_PAY_LOGIN: string;
  private CRYSTAL_PAY_SECRET_1: string;
  private CRYSTAL_PAY_SECRET_2: string;
  private CRYSTAL_PAY_CALLBACK: string;
  private CRYSTAL_PAY_CALLBACK_V2: string;
  private CRYSTAL_PAY_REDIRECT: string;

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.CRYSTAL_PAY_LOGIN = configService.getOrThrow('CRYSTAL_PAY_LOGIN');
    this.CRYSTAL_PAY_CALLBACK = configService.getOrThrow(
      'CRYSTAL_PAY_CALLBACK',
    );
    this.CRYSTAL_PAY_CALLBACK_V2 = configService.getOrThrow(
      'CRYSTAL_PAY_CALLBACK_V2',
    );
    this.CRYSTAL_PAY_REDIRECT = configService.getOrThrow(
      'CRYSTAL_PAY_REDIRECT',
    );
    this.CRYSTAL_PAY_SECRET_1 = configService.getOrThrow(
      'CRYSTAL_PAY_SECRET_1',
    );
    this.CRYSTAL_PAY_SECRET_2 = configService.getOrThrow(
      'CRYSTAL_PAY_SECRET_2',
    );
  }

  public async generatePayLink<T extends ExtraDataDto>(
    amount_in_usd: number,
    extra?: T,
  ) {
    const params = new URLSearchParams();

    params.append('o', 'invoice-create');
    params.append('n', this.CRYSTAL_PAY_LOGIN);
    params.append('s', this.CRYSTAL_PAY_SECRET_1);
    params.append('amount', amount_in_usd.toString());
    params.append('callback', this.CRYSTAL_PAY_CALLBACK);
    params.append('redirect', this.CRYSTAL_PAY_REDIRECT);
    params.append('currency', 'USD');
    typeof extra !== 'undefined' &&
      params.append('extra', JSON.stringify({ ...extra, amount_in_usd }));

    const response = this.httpService.get(`/?${params.toString()}`);

    const { data } = await firstValueFrom(response);

    return data;
  }

  public async generatePayLinkV2<T extends ExtraDataDto>(
    amount_in_usd: number,
    extra: T,
  ) {
    const response = this.httpService.post(
      `/invoice/create/`,
      {
        auth_login: this.CRYSTAL_PAY_LOGIN,
        auth_secret: this.CRYSTAL_PAY_SECRET_1,
        type: 'topup',
        currency: 'USD',
        callback_url: this.CRYSTAL_PAY_CALLBACK_V2,
        redirect_url: this.CRYSTAL_PAY_REDIRECT,
        amount: amount_in_usd,
        extra: JSON.stringify({ ...extra, amount_in_usd }),
        lifetime: 30,
      },
      {
        baseURL: 'https://api.crystalpay.ru/v2',
      },
    );

    const { data } = await firstValueFrom(response);

    return data;
  }

  public isValidPayment(payment: CrystalPaymentEventDto): boolean {
    const { ID, CURRENCY, HASH: payment_hash } = payment;
    const hash = crypto
      .createHash('sha1')
      .update(`${ID}:${CURRENCY}:${this.CRYSTAL_PAY_SECRET_2}`)
      .digest('hex');

    return hash == payment_hash;
  }

  public isValidPaymentV2(id: string, signature: string) {
    const hash = crypto
      .createHash('sha1')
      .update(`${id}:Salt ${this.CRYSTAL_PAY_SECRET_2}`)
      .digest('hex');
    return hash == signature;
  }
}
