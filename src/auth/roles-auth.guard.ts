import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { Roles } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { ErrorCodes, ForbiddenException } from 'src/common';
import { TokenService } from 'src/token/token.service';
import { JwtAuthGuard } from './jwt-auth.guard';

const RolesGuard = (roles?: Roles[]): Type<CanActivate> => {
  class RoleGuardMixin extends JwtAuthGuard {
    constructor(
      public tokenService: TokenService,
      public prismaService: PrismaService,
    ) {
      super(tokenService, prismaService);
    }

    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      if (!roles?.length) {
        return true;
      }

      const request = context.switchToHttp().getRequest();
      const { user } = request;

      const has_role = roles.some((role) => role == user?.role);

      if (!has_role) {
        throw new ForbiddenException(
          { message: 'Not enough rights' },
          ErrorCodes.NotEnoughRights,
        );
      }

      return true;
    }
  }

  return mixin(RoleGuardMixin);
};

export default RolesGuard;
