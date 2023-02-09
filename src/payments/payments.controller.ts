import {
  Body,
  Controller,
  Get,
  Ip,
  Logger,
  Post,
  Query,
  Req,
  UseGuards,
  Version,
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import e from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtPayload, Keys, Versions } from 'src/common';
import {
  CrystalPaymentEventDto,
  CrystalPaymentV2EventDto,
} from 'src/crystal-pay/dto';
import { PaymentsService } from './payments.service';

@ApiTags('Платежи')
@Controller('payments')
export class PaymentsController {
  private logger = new Logger('PaymentsController');

  constructor(private paymentsService: PaymentsService) {}

  @ApiOperation({
    description:
      'Метод для платежной системы. Не вызывается напрямую с фронта!',
  })
  @Get('/new')
  public onNewPayment(
    @Query() dto: CrystalPaymentEventDto,
    @Req() req: e.Request,
  ) {
    this.logger.log(`New payment: ${dto.EXTRA.id}: ${dto.ID}:${dto.AMOUNT}`);
    return this.paymentsService.onNewCrystalPayment(
      dto,
      req.header('X-Real-IP') || req.socket.remoteAddress || req.ip,
    );
  }

  @ApiOperation({
    description:
      'Метод для платежной системы V2. Не вызывается напрямую с фронта!',
  })
  @Post('/v2/new')
  public onNewPaymentV2(
    @Body() dto: CrystalPaymentV2EventDto,
    @Req() req: e.Request,
  ) {
    return this.paymentsService.onNewCrystalPaymentV2(
      dto,
      req.header('X-Real-IP') || req.socket.remoteAddress || req.ip,
    );
  }

  @ApiHeader({ name: Keys.AccessToken, description: 'Токен доступа' })
  @ApiOperation({
    description:
      'V2!! Не вижу смысла расписывать DTO. Так как данные идут напрямик с <a href="https://crystalpay.ru/">Crystal Pay API</a>',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/get-link')
  public topUpBalanceV2(
    @Query('amount') amount: string,
    @JwtPayload('user_id') user_id: number,
  ) {
    return this.paymentsService.topUpBalanceV2(user_id, Number(amount));
  }

  @ApiHeader({ name: Keys.AccessToken, description: 'Токен доступа' })
  @ApiOperation({
    description:
      'Не вижу смысла расписывать DTO. Так как данные идут напрямик с <a href="https://crystalpay.ru/docs/API-docs.html">Crystal Pay API</a>',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/balance')
  public topUpBalance(
    @Query('amount') amount: string,
    @JwtPayload('user_id') user_id: number,
  ) {
    return this.paymentsService.topUpBalance(user_id, Number(amount));
  }
}
