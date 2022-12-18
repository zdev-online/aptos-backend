import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Version, Headers } from '@nestjs/common/decorators';
import { HttpStatus } from '@nestjs/common/enums';
import {
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger/dist';
import { Recaptcha } from '@nestlab/google-recaptcha/decorators/recaptcha';
import { Keys, Versions } from 'src/common';
import { AuthService } from './auth.service';
import { AuthResponseDto, SignInDto, SignUpConfirmDto, SignUpDto } from './dto';

@ApiTags('Авторизация | Регистрация | Аунтификация')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiHeader({ name: 'Version', enum: Versions })
  @ApiOperation({ description: 'Регистрация нового пользователя' })
  @ApiCreatedResponse({
    type: AuthResponseDto,
    description: 'Ответ при успешной регистрации',
  })
  @Recaptcha({
    score: (score) => score >= 0.5,
    response: (req) => (req.body.recaptcha || '').toString(),
    action: 'signup',
  })
  @Version(Versions.Alpha)
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  public async signup(@Body() dto: SignUpDto) {
    return await this.authService.signup(dto);
  }

  @ApiHeader({ name: 'Version', enum: Versions })
  @ApiOperation({ description: 'Подтверждение регистрации' })
  @ApiOkResponse({
    description: 'Ответ при успешном подтверждении - не возвращается',
  })
  @Version(Versions.Alpha)
  @HttpCode(HttpStatus.OK)
  @Post('signup/confirm')
  public async signupConfirm(@Body() dto: SignUpConfirmDto) {
    return this.authService.signupConfirm(dto);
  }

  @ApiHeader({ name: 'Version', enum: Versions })
  @ApiOperation({ description: 'Авторизация' })
  @ApiOkResponse({
    type: AuthResponseDto,
    description: 'Ответ при успешном входе',
  })
  @Recaptcha({
    score: (score) => score >= 0.5,
    response: (req) => (req.body.recaptcha || '').toString(),
    action: 'signin',
  })
  @Version(Versions.Alpha)
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  public async signin(@Body() dto: SignInDto) {
    return await this.authService.signin(dto);
  }

  @ApiHeader({ name: Keys.RefreshToken, description: 'Токен обновления' })
  @ApiHeader({ name: 'Version', enum: Versions })
  @ApiOperation({ description: 'Обновление токенов доступа' })
  @ApiOkResponse({
    type: AuthResponseDto,
    description: 'Ответ при успешном обновлении',
  })
  @Version(Versions.Alpha)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  public async refresh(@Headers(Keys.RefreshToken) refresh_token: string) {
    return this.authService.refresh(refresh_token);
  }

  @ApiHeader({ name: 'Version', enum: Versions })
  @ApiOperation({
    description:
      'Метод пока что по сути - чисто для вида, мб в будущем будет что-то делать.',
  })
  @Version(Versions.Alpha)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  public async logout() {
    return this.authService.logout();
  }
}
