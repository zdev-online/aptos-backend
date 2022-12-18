import { Injectable } from '@nestjs/common';
import * as e from 'express';
import { PrismaService } from 'nestjs-prisma';
import { join } from 'path';
import { IsConnectedResponseDto } from './dto';

@Injectable()
export class DomainsService {
  private root_path: string = join(process.cwd());
  private staticHandler = e.static(this.root_path);

  constructor(private prismaService: PrismaService) {}

  public async getPageOrFile(req: e.Request, res: e.Response): Promise<any> {
    const host = req.headers.host;

    const domain = await this.prismaService.domains.findUnique({
      where: { host },
    });

    if (!domain) {
      res
        .status(404)
        .send(
          `<center><h1>404 Not Found</h1></center><hr><center>nginx${
            process.env.MODE == 'development' && ' from nest'
          }</center>`,
        );
      return;
    }

    return this.staticHandler(req, res, () =>
      res
        .status(404)
        .send(
          `<center><h1>404 Not Found</h1></center><hr><center>nginx${
            process.env.MODE == 'development' && ' from nest'
          }</center>`,
        ),
    );
  }

  public isConnected(
    host: string,
    path: string,
    domain: string,
  ): IsConnectedResponseDto {
    return { host, path, is_connected: host == domain };
  }
}
