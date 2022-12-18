import { Injectable } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common/services';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class MailerService {
  private FRONTEND_HOST: string;
  private SIGNUP_CONFIRM_TOKEN_SECRET: string;
  private SIGNUP_CONFIRM_TOKEN_EXPIRES_IN: number;
  private CHANGE_EMAIL_CONFIRM_TOKEN_SECRET: string;
  private CHANGE_EMAIL_CONFIRM_TOKEN_EXPIRES_IN: number;

  private logger = new Logger('Mailer');

  constructor(
    private mailer: NestMailerService,
    private tokenService: TokenService,
    private configService: ConfigService,
  ) {
    this.FRONTEND_HOST = configService.getOrThrow('FRONTEND_HOST');
    this.SIGNUP_CONFIRM_TOKEN_SECRET = configService.getOrThrow(
      'SIGNUP_CONFIRM_TOKEN_SECRET',
    );
    this.SIGNUP_CONFIRM_TOKEN_EXPIRES_IN = +configService.getOrThrow(
      'SIGNUP_CONFIRM_TOKEN_EXPIRES_IN',
    );
    this.CHANGE_EMAIL_CONFIRM_TOKEN_SECRET = configService.getOrThrow(
      'CHANGE_EMAIL_CONFIRM_TOKEN_SECRET',
    );
    this.CHANGE_EMAIL_CONFIRM_TOKEN_EXPIRES_IN = +configService.getOrThrow(
      'CHANGE_EMAIL_CONFIRM_TOKEN_EXPIRES_IN',
    );
  }

  /** Письмо с подтверждением регистрации */
  public async sendSignUpConfirmation(
    email: string,
    user_id: number,
  ): Promise<void> {
    try {
      const token = await this.tokenService.generateAnyToken(
        { email, user_id },
        this.SIGNUP_CONFIRM_TOKEN_SECRET,
        this.SIGNUP_CONFIRM_TOKEN_EXPIRES_IN,
      );

      const url = this.getLink('/auth/signup/confirm', { token });

      await this.mailer.sendMail({
        to: email,
        template: 'signup-confirmation',
        context: {
          url,
        },
      });
    } catch (error) {
      this.logger.error(`Не удалось отправить письмо: ${error}`);
    }
  }

  /** Письмо с подтверждением смены пароля  */
  public async sendChangeEmailConfirmation(
    new_email: string,
    user_id: number,
  ): Promise<void> {
    try {
      const token = await this.tokenService.generateAnyToken(
        { email: new_email, user_id },
        this.CHANGE_EMAIL_CONFIRM_TOKEN_SECRET,
        this.CHANGE_EMAIL_CONFIRM_TOKEN_EXPIRES_IN,
      );

      const url = this.getLink('/profile/change/email/confirm', { token });

      await this.mailer.sendMail({
        to: new_email,
        template: 'change-email-confirmation',
        context: {
          url,
          email: new_email,
        },
      });
    } catch (error) {
      this.logger.error(`Не удалось отправить письмо: ${error}`);
    }
  }

  /** Данные токена подтверждения регистрации */
  public getSignUpConfirmTokenOptions() {
    return {
      secret: this.SIGNUP_CONFIRM_TOKEN_SECRET,
      expiresIn: this.SIGNUP_CONFIRM_TOKEN_EXPIRES_IN,
    };
  }

  /** Данные токена для подтверждения смены почты */
  public getChangeEmailConfirmTokenOptions() {
    return {
      secret: this.CHANGE_EMAIL_CONFIRM_TOKEN_SECRET,
      expiresIn: this.CHANGE_EMAIL_CONFIRM_TOKEN_EXPIRES_IN,
    };
  }

  private getLink(path: string, search_params: Record<string, any>): string {
    const url = new URL(path, this.FRONTEND_HOST);

    const keys = Object.keys(search_params);
    for (const key of keys) {
      url.searchParams.append(key, search_params[key]);
    }

    return url.toString();
  }
}
