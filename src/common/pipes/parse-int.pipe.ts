import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { ErrorCodes } from '../constants';
import { BadRequestException } from '../exceptions';

@Injectable()
export class ParseIntPipe implements PipeTransform<string> {
  async transform(value: string, metadata: ArgumentMetadata) {
    const number = parseInt(value, 10);
    if (Number.isNaN(number)) {
      throw new BadRequestException(
        { message: 'profile_id must be a number' },
        ErrorCodes.InvalidData,
      );
    }
    return number;
  }
}
