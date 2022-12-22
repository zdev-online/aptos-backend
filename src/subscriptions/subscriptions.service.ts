import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule/dist';
import { SubscriptionType } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import {
  MONTH_SUBSCRIBE_PRICE_IN_DOLLARS,
  ErrorCodes,
  MONTH_SUBSCRIBE_TTL,
  BadRequestException,
  ForbiddenException,
} from 'src/common';
import { UsersEntity } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { ChangeUserSubscritptionDto } from './dto';

@Injectable()
export class SubscriptionsService {
  private logger = new Logger('Subscriptions');

  constructor(
    private userService: UserService,
    private prismaService: PrismaService,
  ) {}

  /** Покупка месячной подписки */
  public async buyMonthSubscription(user: UsersEntity) {
    if (user.balance < MONTH_SUBSCRIBE_PRICE_IN_DOLLARS) {
      throw new BadRequestException(
        { message: 'Not enough money' },
        ErrorCodes.NotEnoughMoney,
      );
    }

    const user_data = await this.userService.findById(user.id);
    if (user_data?.subscription?.type == 'MONTH') {
      throw new BadRequestException(
        { message: 'You already have this subscription' },
        ErrorCodes.AlreadyHaveSubscribtion,
      );
    }

    await this.userService.updateById(user.id, {
      subscription: {
        update: {
          expires_in: new Date(Date.now() + MONTH_SUBSCRIBE_TTL),
          type: 'MONTH',
        },
      },
      balance: {
        decrement: MONTH_SUBSCRIBE_PRICE_IN_DOLLARS,
      },
    });
  }

  // Выбрать подписку воркера, метод вообще хз зачем сейчас.
  public async selectWorker(current_user: UsersEntity) {
    const user = await this.userService.findById(current_user.id);
    if (user?.subscription?.type == 'MONTH') {
      throw new ForbiddenException(
        {
          message: 'You cannot select this subscription now',
        },
        ErrorCodes.ForbiddenAction,
      );
    }

    return;
  }

  /** Сменить подприску пользователя */
  public async changeUserSubscritption(dto: ChangeUserSubscritptionDto) {
    const current_subscription =
      await this.prismaService.subscriptions.findUnique({
        where: {
          user_id: dto.user_id,
        },
      });

    if (!current_subscription) {
      throw new BadRequestException(
        { message: 'User subscription not found' },
        ErrorCodes.SubscribtionNotFound,
      );
    }

    if (current_subscription.type == dto.type) {
      throw new BadRequestException(
        {
          message: 'User already have this subscription',
        },
        ErrorCodes.AlreadyHaveSubscribtion,
      );
    }

    if (dto.type == SubscriptionType.MONTH) {
      return this.prismaService.subscriptions.update({
        where: {
          id: current_subscription.id,
        },
        data: {
          type: dto.type,
          expires_in: new Date(Date.now() + MONTH_SUBSCRIBE_TTL),
        },
      });
    }

    return this.prismaService.subscriptions.update({
      where: {
        id: current_subscription.id,
      },
      data: {
        type: dto.type,
        expires_in: null,
      },
    });
  }

  /** Найти и удалить просроченные подписки */
  @Cron('10 * * * *', {
    timeZone: 'Europe/Moscow',
    name: `${SubscriptionsService.name}-findAndUpdateToWorkerExpired`,
  })
  public async findAndUpdateToWorkerExpired() {
    try {
      const { count } = await this.prismaService.subscriptions.updateMany({
        where: {
          expires_in: {
            lte: new Date(),
          },
        },
        data: {
          type: SubscriptionType.WORKER,
        },
      });

      this.logger.log(`Обновлено истекших подписок до воркера: ${count}`);
    } catch (error) {
      this.logger.warn(
        `Не удалось обновить до воркера истекшие подписки. Причина: ${error}`,
      );
    }
  }
}
