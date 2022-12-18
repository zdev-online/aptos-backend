import {
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import * as e from 'express';
import { DomainsService } from './domains.service';
import { IsConnectedResponseDto } from './dto';

@ApiTags('Домены')
@Controller('domains')
export class DomainsController {
  constructor(private domainsService: DomainsService) {}
  /**
    Метод для проверки доступности домена. 
    
    Инструкция по использованию:
      С панели фронта - делаем запрос на user-domain.com/is-connected

      Если вернется: `IsConnectedResponseDto`, то домен подключен и все работает.
      
      Если нет, то что-то настроили неправильно.
  */
  @ApiOperation({
    description: `Метод для проверки того - подключен ли домен или нет.
    Сделать запрос на http(s?)://user-domain.com/is-connected
    `,
  })
  @ApiHeader({
    name: 'Host',
    required: false,
    description: 'Не указыаается, значение подставляется само',
  })
  @ApiParam({
    name: 'domain',
    required: false,
    description:
      'Не указыаается, nginx сам подставляет значение, если делать запрос через домен привязанный к нам',
  })
  @ApiOkResponse({
    type: () => IsConnectedResponseDto,
    description: 'Если домен подключен, то `is_connected` будет равен `true`',
  })
  @Post('/:domain/is-connected')
  public isConnected(
    @Param('domain') domain: string,
    @Headers('Host') host: string,
    @Req() req: e.Request,
  ): IsConnectedResponseDto {
    return this.domainsService.isConnected(host, req.path, domain);
  }

  @Get('/*')
  public getPageOrFile(
    @Req() req: e.Request,
    @Res({ passthrough: false }) res: e.Response,
  ) {
    return this.domainsService.getPageOrFile(req, res);
  }
}
