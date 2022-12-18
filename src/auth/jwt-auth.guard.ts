import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import e from 'express';
import { PrismaService } from 'nestjs-prisma';
import { ErrorCodes, Keys, UnauthorizedException } from 'src/common';
import { ITokensPayload } from 'src/token/dto';
import { TokenService } from 'src/token/token.service';

export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(TokenService) public tokenService: TokenService,
    @Inject(PrismaService) public prismaService: PrismaService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: e.Request & { payload: ITokensPayload; user: any } = context
      .switchToHttp()
      .getRequest();

    const access_token = request.headers[Keys.AccessToken] as string;

    if (!access_token) {
      throw new UnauthorizedException(
        { message: 'Invalid access token' },
        ErrorCodes.InvalidAccessToken,
      );
    }

    const payload = await this.tokenService.validateAccessToken(access_token);
    if (!payload) {
      throw new UnauthorizedException(
        { message: 'Invalid access token' },
        ErrorCodes.InvalidAccessToken,
      );
    }

    request.payload = payload;
    request.user = await this.prismaService.users.findUnique({
      where: {
        id: payload.user_id,
      },
    });

    if (!request.user) {
      throw new UnauthorizedException(
        { message: 'Invalid access token' },
        ErrorCodes.UserNotFound,
      );
    }

    return true;
  }
}
