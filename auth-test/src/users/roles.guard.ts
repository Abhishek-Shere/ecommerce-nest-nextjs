import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from './users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UsersService,
  ) {}

  async matchRoles(roles: string[], userRole: string[]) {
    return roles.some((role) => userRole.includes(role));
  }

  hasPermission(requiredPermission: string[], httpMethod: string): boolean {
    console.log('hasPermission', requiredPermission, httpMethod);
    return requiredPermission.some((permission) => permission === httpMethod);
  }

  async getUser(userId: string) {
    const userdata = await this.userService.getuser(userId);
    return userdata.roles;
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    const rolePermissions = this.reflector.get<
      { role: string; permissions: string[] }[]
    >('permissions', context.getHandler());
    console.log('================================', rolePermissions);
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const httpMethod = request.method;
    console.log('user', rolePermissions, httpMethod);
    const userRole = await this.getUser(request.user.id);
    console.log(roles);
    const checkRoles = this.matchRoles(roles, userRole);
    const permissionCheck = rolePermissions.some(({ role, permissions }) => {
      console.log('=====>', userRole, userRole.includes(role), role);
      if (userRole.includes(role)) {
        console.log('99', role);
        return this.hasPermission(permissions, httpMethod);
      }
      // return false; // If the user's role doesn't match the required role, allow access
    });

    return checkRoles && permissionCheck;
  }
}
