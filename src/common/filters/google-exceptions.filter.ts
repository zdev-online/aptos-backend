import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { GoogleRecaptchaException } from '@nestlab/google-recaptcha';
import e from 'express';
import { ErrorCodes } from '../constants';
import { BadRequestException } from '../exceptions';

@Catch(GoogleRecaptchaException)
export class GoogleRecaptchaFilter implements ExceptionFilter {
  public catch(exception: GoogleRecaptchaException, host: ArgumentsHost): any {
    const response: e.Response = host.switchToHttp().getResponse();

    const error = exception.errorCodes[0].split('-').join(' ');

    const bad_request_exception = new BadRequestException(
      error.charAt(0).toUpperCase() + error.slice(1),
      ErrorCodes.GoogleCaptchaError,
    );

    return response.status(400).json(bad_request_exception.getResponse());
  }
}
