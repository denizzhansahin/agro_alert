import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Role } from '../enums/role.enum'; // Role enum'unun doğru yerden import edildiğinden emin olun
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true; // Rol gereksinimi yoksa erişime izin ver

    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req; // GraphQL bağlamından request nesnesini al
    const user = request.user;

    if (!request || !request.user) {
      console.log("Kullanıcı bilgisi yok roles guard");
      return false; // Kullanıcı yoksa erişimi engelle
    }

    console.log("Kullanıcı bilgisi roles guard:", user);

    if (!user) return false; // Kullanıcı yoksa erişimi engelle

    const hasRequiredRole = requiredRoles.some((role) => user.role === role);
    console.log("Gerekli rol kontrolü:", hasRequiredRole);
    return hasRequiredRole; // Gerekli role sahipse erişime izin ver
  }
}