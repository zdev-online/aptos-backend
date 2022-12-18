import { Controller, Get, Ip, Query, UseGuards, Version } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtPayload, Keys, Versions } from 'src/common';
import { CrystalPaymentEventDto } from 'src/crystal-pay/dto';
import { PaymentsService } from './payments.service';

@ApiTags('Платежи')
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @ApiOperation({
    description:
      'Метод для платежной системы. Не вызывается напрямую с фронта!',
  })
  @Get('/new')
  public onNewPayment(@Query() dto: CrystalPaymentEventDto, @Ip() ip: string) {
    return this.paymentsService.onNewCrystalPayment(dto, ip);
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
