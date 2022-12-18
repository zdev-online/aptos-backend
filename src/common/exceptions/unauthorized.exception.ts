import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class UnauthorizedException extends BaseException {
  constructor(objectOrString: string | object, code: number) {
    super(objectOrString, HttpStatus.UNAUTHORIZED, code);
  }
}
