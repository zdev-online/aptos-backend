import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class ConflictException extends BaseException {
  constructor(objectOrString: string | object, code: number) {
    super(objectOrString, HttpStatus.CONFLICT, code);
  }
}
