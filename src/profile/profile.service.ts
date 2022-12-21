import { Injectable } from '@nestjs/common';
import { BadRequestException, ErrorCodes } from 'src/common';
import { MailerService } from 'src/mailer/mailer.service';
import { TokenService } from 'src/token/token.service';
import { PrivateUserResponseDto, UserResponseDto } from 'src/user/dto';
import { UserService } from 'src/user/user.service';
import { ChangeEmailDto, ChangePasswordDto } from './dto';

@Injectable()
export class ProfileService {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private mailerService: MailerService,
  ) {}

  /** Сменить пароль */
  public async changePassword(user_id: number, dto: ChangePasswordDto) {
    const { old_password, password: not_hashed_password } = dto;

    const user = await this.userService.findById(user_id);

    const is_valid_password = await this.userService.isValidPassword(
      old_password,
      user!.password,
    );
    if (!is_valid_password) {
      throw new BadRequestException(
        { message: 'Invalid old password' },
        ErrorCodes.InvalidPassword,
      );
    }

    const password = await this.userService.hashPassword(not_hashed_password);

    await this.userService.updateById(user_id, { password });

    return;
  }

  /** Сменить e-mail */
  public async changeEmail(user_id: number, dto: ChangeEmailDto) {
    const { new_email, password } = dto;

    const user = await this.userService.findById(user_id);

    const is_valid_password = await this.userService.isValidPassword(
      password,
      user!.password,
    );
    if (!is_valid_password) {
      throw new BadRequestException(
        { message: 'Invalid password' },
        ErrorCodes.InvalidPassword,
      );
    }

    this.mailerService.sendChangeEmailConfirmation(new_email, user!.id);
  }

  /** Подтверждение смены E-Mail */
  public async changeEmailConfirm(token: string) {
    const payload = await this.tokenService.validateAnyToken<{
      email: string;
      user_id: number;
    }>(token, this.mailerService.getSignUpConfirmTokenOptions().secret);

    if (!payload) {
      throw new BadRequestException(
        { message: 'Invalid confirmation token' },
        ErrorCodes.InvalidConfirmationTolen,
      );
    }

    await this.userService.updateById(payload.user_id, {
      email: payload.email,
    });
  }

  /** Получить данные профиля  */
  public async getProfile(
    user_id: number,
    profile_id?: number,
  ): Promise<UserResponseDto | PrivateUserResponseDto> {
    const user = await this.userService.findById(profile_id || user_id);
    if (user_id == profile_id || typeof profile_id == 'undefined') {
      return new UserResponseDto(user!);
    } else {
      return new PrivateUserResponseDto(user!);
    }
  }
}
