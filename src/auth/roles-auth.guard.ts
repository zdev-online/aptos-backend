import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { Roles } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
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
      const { user } = request.payload;

      return roles.some((role) => role == user?.role);
    }
  }

  return mixin(RoleGuardMixin);
};

export default RolesGuard;
