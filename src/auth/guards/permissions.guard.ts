import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    //? Fetching permission required by API
    const requiredPermission = this.reflector.get<string[]>('permissions', context.getHandler());

    //? If no permission required allow
    if (!requiredPermission) {
      return true;
    }

    //? Get used data that logged-in
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    //? Load user from db with roles and permissions
    const dbUser = await this.userService.findByIdWithRolesAndPermissions(user.userId);

    //? collect all permissions
    const userPermissions = [];
    for (const role of dbUser.roles) {
      for (const permission of role.permissions) {
        userPermissions.push(permission.name);
      }
    }

    //? Check permissions
    for (const permission of requiredPermission) {
      if (!userPermissions.includes(permission)) {
        throw new ForbiddenException('Permission denied');
      }
    }
    return true;
  }
}
