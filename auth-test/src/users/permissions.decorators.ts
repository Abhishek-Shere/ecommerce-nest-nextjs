// multiple-permissions.decorator.ts
import { SetMetadata } from '@nestjs/common';
interface RolePermission {
  role: string;
  permissions: string[];
}
export const MultiplePermissions = (...permissions: RolePermission[]) =>
  SetMetadata('permissions', permissions);
