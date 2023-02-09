import {
  Logger,
  ValidationPipe,
  VersioningType,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { ClassSerializerInterceptor } from '@nestjs/common/serializer';
import { ConfigService } from '@nestjs/config/dist';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { PrismaService } from 'nestjs-prisma';
import { AppModule } from './app.module';
import {
  ErrorCodes,
  BadRequestException,
  BaseException,
  GoogleRecaptchaFilter,
} from './common';
import { LoggingInterceptor } from './common/interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    header: 'Version',
    type: VersioningType.HEADER,
    defaultVersion: VERSION_NEUTRAL,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      whitelist: true,
      exceptionFactory: ([error]) => {
        const message = Object.values(
          error.constraints || { invalid_data: 'Unknown invalid data' },
        )[0];
        return new BadRequestException({ message }, ErrorCodes.InvalidData);
      },
    }),
  );

  app.useGlobalFilters(new GoogleRecaptchaFilter());

  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new ClassSerializerInterceptor(reflector, {
      strategy: 'exposeAll',
      exposeUnsetFields: false,
    }),
  );

  const configService = app.get(ConfigService);
  const port = configService.getOrThrow('PORT');

  const prismaService: PrismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  if (process.env.MODE == 'development') {
    const example_error_1 = new BaseException(
      {
        message: 'Пример ошибки 1',
      },
      HttpStatus.BAD_REQUEST,
      ErrorCodes.Unknown,
    ).getResponse();

    const example_error_2 = new BaseException(
      [
        { message: 'Пример ошибки 2' },
        { message: 'Пример ошибки 3' },
        { message: 'Пример ошибки 4' },
      ],
      HttpStatus.BAD_REQUEST,
      ErrorCodes.UserNotFound,
    ).getResponse();

    const example_error_3 = new BaseException(
      'Пример ошибки 5',
      HttpStatus.BAD_REQUEST,
      ErrorCodes.UserAlreadyExists,
    ).getResponse();

    const config = new DocumentBuilder()
      .setTitle('Aptos Backend')
      .setDescription(
        `Описание Aptos API.<br>
      <b>Важно!!!</b> Ответы с кодом ошибки могу возвращать следующие данные: <br><pre style="white-space: pre-line;">${JSON.stringify(
        example_error_1,
        null,
        2,
      ).replace(/\n/gi, '<br>')}</pre><br><pre>${JSON.stringify(
          example_error_2,
          null,
          2,
        ).replace(/\n/gi, '<br>')}</pre><br><pre>${JSON.stringify(
          example_error_3,
          null,
          2,
        ).replace(
          /\n/gi,
          '<br>',
        )}</pre><br><b>Ну, и соответственно статус ответа в header\`ах</b>`,
      )
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  app.enableCors({ origin: '*' });
  app.use(
    helmet({
      xssFilter: true,
      hidePoweredBy: true,
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: false,
      contentSecurityPolicy: false,
      crossOriginOpenerPolicy: false,
      originAgentCluster: false,
    }),
  );

  await app.listen(port, () =>
    Logger.log(`Приложение запущено на ${port} порту.`, 'App'),
  );
}

bootstrap().catch((error) =>
  Logger.error(
    `Не удалось запустить приложение. Причина: ${error.message}`,
    `App`,
  ),
);
