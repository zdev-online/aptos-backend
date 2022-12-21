import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
  Version,
} from '@nestjs/common';
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  OmitType,
} from '@nestjs/swagger';
import { Roles } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import RolesGuard from 'src/auth/roles-auth.guard';
import {
  ApiPaginatedResponse,
  JwtPayload,
  Keys,
  PageDto,
  ParseIntPipe,
  User,
  Versions,
} from 'src/common';
import { UsersEntity } from 'src/user/user.entity';
import {
  ChangeEmailDto,
  ChangePasswordDto,
  ConfirmChangeEmailDto,
  GetUsersListDto,
} from './dto';
import { ProfileService } from './profile.service';

@ApiTags('Профиль')
@ApiHeader({ name: Keys.AccessToken, description: 'Токен доступа' })
@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @ApiHeader({ name: 'Version', enum: Versions })
  @ApiOperation({
    description: 'Смена пароля. При успешной операции - ничего не возвращает.',
  })
  @HttpCode(HttpStatus.OK)
  @Version(Versions.Alpha)
  @Post('/change/password')
  public changePassword(
    @Body() dto: ChangePasswordDto,
    @JwtPayload('user_id') user_id: number,
  ): Promise<void> {
    return this.profileService.changePassword(user_id, dto);
  }

  @ApiHeader({ name: 'Version', enum: Versions })
  @ApiOperation({
    description: 'Смена почты. При успешной операции - ничего не возвращает.',
  })
  @HttpCode(HttpStatus.OK)
  @Version(Versions.Alpha)
  @Post('/change/email')
  public changeEmail(
    @Body() dto: ChangeEmailDto,
    @JwtPayload('user_id') user_id: number,
  ) {
    return this.profileService.changeEmail(user_id, dto);
  }

  @ApiHeader({ name: 'Version', enum: Versions })
  @ApiOperation({
    description:
      'Потдверждение смены почты. При успешной операции - ничего не возвращает.',
  })
  @HttpCode(HttpStatus.OK)
  @Version(Versions.Alpha)
  @Post('/change/email/confirm')
  public changeEmailConfirm(@Body() dto: ConfirmChangeEmailDto) {
    return this.profileService.changeEmailConfirm(dto.token);
  }

  @ApiHeader({ name: 'Version', enum: Versions })
  @ApiOperation({
    description: 'Получить профиль по ID',
  })
  @ApiOkResponse({
    type: () => UsersEntity,
    description: 'Данные пользователя',
  })
  @HttpCode(HttpStatus.OK)
  @Version(Versions.Alpha)
  @Get('/get/:profile_id')
  public getProfile(
    @JwtPayload('user_id') user_id: number,
    @Param('profile_id') profile_id: string,
  ) {
    return this.profileService.getProfile(user_id, +profile_id);
  }

  @ApiHeader({ name: 'Version', enum: Versions })
  @ApiOperation({
    description: 'Получить список пользователей',
  })
  @UseGuards(RolesGuard([Roles.ADMIN, Roles.MODERATOR, Roles.DEVELOPER]))
  @HttpCode(HttpStatus.OK)
  @Version(Versions.Alpha)
  @ApiPaginatedResponse(class extends OmitType(UsersEntity, ['domains']) {})
  @Get('/list')
  public getUsersList(
    @User() user: UsersEntity,
    @Query() dto: GetUsersListDto,
  ): Promise<PageDto<Omit<UsersEntity, 'domains'>>> {
    return this.profileService.getUsersList(user, dto);
  }

  @UseGuards(RolesGuard([Roles.ADMIN, Roles.MODERATOR, Roles.DEVELOPER]))
  @ApiHeader({ name: 'Version', enum: Versions })
  @ApiOperation({
    description: 'Заблокировать пользователя',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: () => UsersEntity,
  })
  @Post('/block/:profile_id')
  public blockUser(@Param('profile_id', ParseIntPipe) profile_id: number) {
    return this.profileService.blockUser(profile_id);
  }

  @ApiHeader({ name: 'Version', enum: Versions })
  @ApiOperation({
    description: 'Получить свой профиль',
  })
  @ApiOkResponse({
    type: () => UsersEntity,
    description: 'Данные пользователя',
  })
  @HttpCode(HttpStatus.OK)
  @Version(Versions.Alpha)
  @Get('/')
  public getMe(@JwtPayload('user_id') user_id: number) {
    return this.profileService.getProfile(user_id);
  }
}
