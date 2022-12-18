import { Injectable } from '@nestjs/common';
import {
  ErrorCodes,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from 'src/common';
import { MailerService } from 'src/mailer/mailer.service';
import { TokenService } from 'src/token/token.service';
import { UserResponseDto } from 'src/user/dto';
import { UserService } from 'src/user/user.service';
import { AuthResponseDto, SignInDto, SignUpConfirmDto, SignUpDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private tokenService: TokenService,
    private userService: UserService,
    private mailerService: MailerService,
  ) {}

  /** Регистрация */
  public async signup(dto: SignUpDto): Promise<AuthResponseDto> {
    const { email, password: not_hashed_password } = dto;

    const is_exists = await this.userService.findByEmailLite(email);
    if (is_exists) {
      throw new ConflictException(
        { message: 'The e-mail is already registered' },
        ErrorCodes.UserAlreadyExists,
      );
    }

    const password = await this.userService.hashPassword(not_hashed_password);

    const user = await this.userService.create({ email, password });

    const { access_token, refresh_token } =
      await this.tokenService.generateTokens({ user_id: user.id });

    this.mailerService.sendSignUpConfirmation(user.email, user.id);

    return new AuthResponseDto({
      access_token,
      refresh_token,
      user: new UserResponseDto(user),
    });
  }

  /** Подтверждение регистрации */
  public async signupConfirm(dto: SignUpConfirmDto) {
    const { secret } = this.mailerService.getSignUpConfirmTokenOptions();
    const payload = await this.tokenService.validateAnyToken<{
      email: string;
      user_id: number;
    }>(dto.token, secret);

    if (!payload) {
      throw new BadRequestException(
        { message: 'Invalid confirmation token' },
        ErrorCodes.InvalidConfirmationTolen,
      );
    }

    await this.userService.updateById(payload.user_id, {
      email_confirmed: true,
    });

    return;
  }

  /** Авторизация */
  public async signin(dto: SignInDto): Promise<AuthResponseDto> {
    const { email, password } = dto;

    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new BadRequestException(
        { message: 'User not found' },
        ErrorCodes.UserNotFound,
      );
    }

    const is_valid_password = await this.userService.isValidPassword(
      password,
      user.password,
    );
    if (!is_valid_password) {
      throw new BadRequestException(
        { message: 'Invalid password' },
        ErrorCodes.InvalidPassword,
      );
    }

    const { access_token, refresh_token } =
      await this.tokenService.generateTokens({ user_id: user.id });

    return new AuthResponseDto({
      access_token,
      refresh_token,
      user: new UserResponseDto(user),
    });
  }

  /** Обновление пары токенов */
  public async refresh(old_refresh_token: string) {
    const payload = await this.tokenService.validateRefreshToken(
      old_refresh_token,
    );
    if (!payload) {
      throw new UnauthorizedException(
        { message: 'Not authorized' },
        ErrorCodes.InvalidRefreshToken,
      );
    }

    const user = await this.userService.findById(payload.user_id);

    if (!user) {
      throw new BadRequestException(
        { message: 'User not found' },
        ErrorCodes.UserNotFound,
      );
    }

    const { access_token, refresh_token } =
      await this.tokenService.generateTokens({ user_id: user.id });

    return new AuthResponseDto({
      access_token,
      refresh_token,
      user: new UserResponseDto(user),
    });
  }

  /** Завершение сессии */
  public async logout() {
    return;
  }
}
