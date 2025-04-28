import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { IS_PUBLIC_KEY } from '../decorators/public.deacorator';


@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) return true;

        const gqlContext = GqlExecutionContext.create(context);
        const request = gqlContext.getContext().req;

        if (!request) {
            console.log("JwtAuthGuard: Request nesnesi yok");
            return false;
        }

        console.log("Authorization Header:", request.headers?.authorization);
        const result = super.canActivate(context); // JwtStrategy'yi tetikler

        // Asenkron sonucu ele al
        if (result instanceof Promise) {
            return result.then(res => {
                console.log("Request User:", request.user);
                return res && !!request.user;
            });
        }
        console.log("Request User:", request.user);
        return !!request.user;
    }

    getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req;
    }
}