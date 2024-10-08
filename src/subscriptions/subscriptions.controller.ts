import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Version,
} from '@nestjs/common';
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import RolesGuard from 'src/auth/roles-auth.guard';
import { Keys, User, Versions } from 'src/common';
import { UsersEntity } from 'src/user/user.entity';
import { ChangeUserSubscritptionDto } from './dto';
import { SubscriptionEntity } from './subcription.entity';
import { SubscriptionsService } from './subscriptions.service';

@ApiTags('Подписки')
@ApiHeader({ name: Keys.AccessToken, description: 'Токен доступа' })
@UseGuards(JwtAuthGuard)
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  @ApiOperation({ description: 'Покупка месячной подписки.' })
  @ApiOkResponse({ description: 'Ничего не возвращает при успешной операции.' })
  @ApiHeader({ name: 'Version', enum: Versions })
  @HttpCode(HttpStatus.OK)
  @Version(Versions.Alpha)
  @Post('/buy/month')
  public buyMonthSubscription(@User() user: UsersEntity) {
    return this.subscriptionsService.buyMonthSubscription(user);
  }

  @UseGuards(RolesGuard([Roles.ADMIN, Roles.DEVELOPER, Roles.MODERATOR]))
  @ApiOperation({ description: 'Смена подписки для пользователя.' })
  @ApiOkResponse({ type: () => SubscriptionEntity })
  @ApiHeader({ name: 'Version', enum: Versions })
  @HttpCode(HttpStatus.OK)
  @Version(Versions.Alpha)
  @Post('/change')
  public changeUserSubscritption(dto: ChangeUserSubscritptionDto) {
    return this.subscriptionsService.changeUserSubscritption(dto);
  }
}
