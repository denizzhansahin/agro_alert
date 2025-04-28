import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (isPublic) return true;

    const gqlContext = GqlExecutionContext.create(context);
    const request = gqlContext.getContext().req;

    if (!request) {
      console.log("GqlAuthGuard: Request nesnesi yok");
      return false;
    }

    console.log("Authorization Header:", request.headers?.authorization);
    super.canActivate(context); // JWT doğrulamasını çalıştırır

    if (!request.user) {
      console.log("Kullanıcı bilgisi yok gql guard");
      return false;
    }

    console.log("Kullanıcı:", request.user);
    return request;
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      if (info instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token süresi dolmuş, lütfen tekrar giriş yapın.');
      } else if (info instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Geçersiz token.');
      } else {
        throw new UnauthorizedException();
      }
    }
    return user;
  }
}