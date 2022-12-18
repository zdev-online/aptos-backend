import { Global, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ITokensPayload } from './dto';
import { IGeneratedTokens } from './token.interface';

@Injectable()
export class TokenService {
  /** Секеретный ключ токена доступа */
  private ACCESS_TOKEN_SECRET: string;
  /** Время жизни токена доступа в секундах */
  private ACCESS_TOKEN_EXPIRES_IN: number;

  /** Секеретный ключ токена обновления */
  private REFRESH_TOKEN_SECRET: string;
  /** Время жизни токена обновления в секундах */
  private REFRESH_TOKEN_EXPIRES_IN: number;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.ACCESS_TOKEN_SECRET = this.configService.getOrThrow(
      'ACCESS_TOKEN_SECRET',
    );
    this.ACCESS_TOKEN_EXPIRES_IN = +this.configService.getOrThrow(
      'ACCESS_TOKEN_EXPIRES_IN',
    );
    this.REFRESH_TOKEN_SECRET = this.configService.getOrThrow(
      'REFRESH_TOKEN_SECRET',
    );
    this.REFRESH_TOKEN_EXPIRES_IN = +this.configService.getOrThrow(
      'REFRESH_TOKEN_EXPIRES_IN',
    );
  }

  /** Сгенерировать пару токенов  */
  public async generateTokens(
    payload: ITokensPayload,
  ): Promise<IGeneratedTokens> {
    const access_token = await this.jwtService.signAsync(
      payload,
      this.getAccessTokenOptions(),
    );

    const refresh_token = await this.jwtService.signAsync(
      payload,
      this.getRefreshTokenOptions(),
    );

    return { access_token, refresh_token };
  }

  /** Генерация "любого" токена */
  public async generateAnyToken(
    payload: Record<string, any>,
    secret: string,
    expiresIn?: number | undefined,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret,
      expiresIn,
    });
  }

  /** Проверка валидности "любого" токена */
  public async validateAnyToken<T extends object = any>(
    token: string,
    secret: string,
  ): Promise<T | null> {
    return this.jwtService
      .verifyAsync<T>(token, { secret })
      .catch((error) => null);
  }

  /** Проверка валидности токена доступа */
  public async validateAccessToken(
    token: string,
  ): Promise<ITokensPayload | null> {
    return await this.jwtService
      .verifyAsync<ITokensPayload>(token, this.getAccessTokenOptions())
      .catch((error) => null);
  }

  /** Проверка валидности токена обновления */
  public async validateRefreshToken(
    token: string,
  ): Promise<ITokensPayload | null> {
    return await this.jwtService
      .verifyAsync<ITokensPayload>(token, this.getRefreshTokenOptions())
      .catch((error) => null);
  }

  /** Получить опции для токена доступа */
  private getAccessTokenOptions() {
    return {
      secret: this.ACCESS_TOKEN_SECRET,
      expiresIn: this.ACCESS_TOKEN_EXPIRES_IN,
    };
  }

  /** Получить опции для токена обновления */
  public getRefreshTokenOptions() {
    return {
      secret: this.REFRESH_TOKEN_SECRET,
      expiresIn: this.REFRESH_TOKEN_EXPIRES_IN,
    };
  }
}
