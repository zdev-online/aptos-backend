import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class BadRequestException extends BaseException {
  constructor(objectOrString: string | object, code: number) {
    super(objectOrString, HttpStatus.BAD_REQUEST, code);
  }
}
