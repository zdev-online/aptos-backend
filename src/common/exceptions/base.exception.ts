import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseException extends HttpException {
  constructor(
    objectOrString: object | string,
    status_code: HttpStatus,
    code = 0,
  ) {
    if (typeof objectOrString == 'string') {
      super({ error: objectOrString, code }, status_code);
    } else {
      if (objectOrString instanceof Array) {
        super({ errors: objectOrString, code }, status_code);
      } else {
        super({ error: objectOrString, code }, status_code);
      }
    }
  }
}
