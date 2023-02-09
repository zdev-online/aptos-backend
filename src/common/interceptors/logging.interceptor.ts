import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import e from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest() as e.Request;
    Logger.log(
      `${
        request.header('X-Real-IP') ||
        request.socket.remoteAddress ||
        request.ip
      } ${request.path}`,
      `Request`,
    );
    return next.handle().pipe();
  }
}
