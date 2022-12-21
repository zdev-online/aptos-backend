import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class PageMetaDto {
  @ApiProperty({ title: 'Текущая страница' })
  readonly page: number;

  @ApiProperty({ title: 'Сколько записей получено' })
  readonly take: number;

  @ApiProperty({ title: 'Всего записей' })
  readonly total: number;

  @ApiProperty({ title: 'Всего страниц' })
  readonly pages_count: number;

  @ApiProperty({ title: 'Есть ли предыдущая страница' })
  readonly has_previous: boolean;

  @ApiProperty({ title: 'Есть ли следующая страница' })
  readonly has_next_page: boolean;

  constructor({
    take,
    page,
    total,
  }: Pick<PageMetaDto, 'take' | 'page' | 'total'>) {
    this.page = page;
    this.take = take;
    this.total = total;
    this.pages_count = Math.ceil(this.total / this.take);
    this.has_previous = this.page > 1;
    this.has_next_page = this.page < this.pages_count;
  }
}

export class PageDto<T> {
  @IsArray()
  @ApiProperty({ isArray: true, title: 'Данные' })
  readonly data: T[];

  @ApiProperty({ type: () => PageMetaDto, title: 'Метадата' })
  readonly meta: PageMetaDto;

  constructor(data: T[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
