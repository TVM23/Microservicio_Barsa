import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());

    // Si la ruta NO tiene roles requeridos, se permite el acceso
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Se obtiene del `AtGuard` (JWT)

    if (!user || !user.rol) {
      throw new ForbiddenException('No tienes permiso para acceder a esta acción');
    }

    // Si el usuario tiene al menos uno de los roles requeridos, se permite el acceso
    if (requiredRoles.includes(user.rol)) {
      return true;
    }

    throw new ForbiddenException('No tienes el rol necesario para acceder a esta acción');
  }
}

