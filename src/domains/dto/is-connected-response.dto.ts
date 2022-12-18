import { ApiProperty } from '@nestjs/swagger';

export class IsConnectedResponseDto {
  @ApiProperty({ title: 'Название домена, который проверяем' })
  public host: string;

  @ApiProperty({ title: 'Путь по которому обратились' })
  public path: string;

  @ApiProperty({ title: 'Привязан домен или нет' })
  public is_connected: boolean;
}
