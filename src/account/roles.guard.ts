import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<number[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      // Không yêu cầu role nào → cho qua
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    console.log('User:', user);

    if (!user || user.ChucVu === undefined) {
      return false;
    }

    return requiredRoles.includes(user.ChucVu);
  }
}
