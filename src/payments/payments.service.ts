import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { BadRequestException, ErrorCodes } from 'src/common';
import { CrystalPayService } from 'src/crystal-pay/crystal-pay.service';
import { ExtraDataDto, CrystalPaymentEventDto } from 'src/crystal-pay/dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PaymentsService {
  private logger = new Logger('Payments');
  private crystal_pay_ips = [
    '194.124.51.212',
    '193.187.144.239',
    '45.139.108.33',
  ];

  constructor(
    private crystalPayService: CrystalPayService,
    private userService: UserService,
    private prismaService: PrismaService,
  ) {}

  /** Обработка нового платежа */
  public async onNewCrystalPayment(dto: CrystalPaymentEventDto, ip: string) {
    const is_payment_valid = this.crystalPayService.isValidPayment(dto);
    if (!is_payment_valid || !this.crystal_pay_ips.includes(ip)) {
      this.logger.warn(`Невалидный платеж ${ip} ${dto.ID}.`);
      throw new BadRequestException(
        { message: 'Неверные данные платежа' },
        ErrorCodes.InvalidData,
      );
    }

    const user = await this.userService.findById(dto.EXTRA.id);
    if (!user) {
      this.logger.warn(`User not found`);
      throw new BadRequestException(
        { message: 'User not found' },
        ErrorCodes.UserNotFound,
      );
    }

    const payment = await this.findByPaymentSystemId(dto.ID);
    if (payment) {
      throw new BadRequestException(
        { message: 'Payment already exists' },
        ErrorCodes.InvalidData,
      );
    }

    switch (dto.EXTRA.type) {
      case 'top-up-balance': {
        const [, updated_user] = await this.prismaService.$transaction([
          this.prismaService.payments.create({
            data: {
              amount_in_rub: Number(dto.AMOUNT),
              amount_in_usd: dto.EXTRA.amount_in_usd!,
              id_from_pay_system: dto.ID,
            },
          }),
          this.userService.updateById(dto.EXTRA.id, {
            balance: {
              increment: Number(dto.EXTRA.amount_in_usd),
            },
          }),
        ]);
        this.logger.log(
          `Пополнение баланса на сумму ${dto.AMOUNT} руб. (${dto.EXTRA.amount_in_usd}$) пользователем ${updated_user.email}`,
        );
      }
    }

    this.logger.log(
      `Успешный платеж ${ip} ${dto.ID} на сумму ${dto.AMOUNT} (${dto.PAYAMOUNT}).`,
    );
    return { message: 'Успешный платеж' };
  }

  /** Создать ссылку для оплаты */
  public topUpBalance(user_id: number, amount: number) {
    return this.crystalPayService.generatePayLink<ExtraDataDto>(amount, {
      id: user_id,
      type: 'top-up-balance',
    });
  }

  /** Найти платеж по Crystal System ID */
  public findByPaymentSystemId(id_from_pay_system: string) {
    return this.prismaService.payments.findUnique({
      where: {
        id_from_pay_system,
      },
    });
  }
}
