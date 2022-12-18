import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const JwtPayload = createParamDecorator(
  (property: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return property ? request.payload?.[property] : request.payload;
  },
);
