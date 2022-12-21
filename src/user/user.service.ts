import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  /** Создать пользователя */
  public create(data: Prisma.UsersCreateInput) {
    return this.prismaService.users.create({
      data: {
        ...data,
        subscription: {
          create: {
            type: 'WORKER',
          },
        },
      },
      include: {
        domains: true,
        subscription: true,
      },
    });
  }

  /** Найти пользователя по E-Mail */
  public findByEmail(email: string) {
    return this.prismaService.users.findUnique({
      where: {
        email,
      },
      include: {
        domains: {
          include: { template: true },
        },
        subscription: true,
      },
    });
  }

  /** Найти пользователя по ID */
  public findById(id: number) {
    return this.prismaService.users.findUnique({
      where: {
        id,
      },
      include: {
        domains: {
          include: { template: true },
        },
        subscription: true,
      },
    });
  }

  /** Найти пользователя без связанных сущностей */
  public findByEmailLite(email: string) {
    return this.prismaService.users.findUnique({
      where: {
        email,
      },
    });
  }

  /** Найти пользователя без связанных сущностей */
  public findByIdLite(id: number) {
    return this.prismaService.users.findUnique({
      where: {
        id,
      },
    });
  }

  /** Обновить данные пользователя по его E-Mail*/
  public updateByEmail(email: string, data: Prisma.UsersUpdateInput) {
    return this.prismaService.users.update({
      where: { email },
      data,
      include: {
        domains: true,
        subscription: true,
      },
    });
  }

  /** Обновить данные пользователя по его ID*/
  public updateById(id: number, data: Prisma.UsersUpdateInput) {
    return this.prismaService.users.update({
      where: { id },
      data,
      include: {
        domains: true,
        subscription: true,
      },
    });
  }

  /** Узнать валидность пароля */
  public isValidPassword(password: string, encrypted: string) {
    return bcrypt.compare(password, encrypted);
  }

  /** Хэшировать пароль */
  public async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  /** Получить часть */
  public async getPaginated(skip: number, take: number) {
    return this.prismaService.users.findMany({
      skip,
      take,
      include: {
        subscription: true,
      },
    });
  }

  /** Получить количество пользователей */
  public getCount() {
    return this.prismaService.users.count();
  }
}
