/**
 * /frontend/src/services/security/rbacValidator.ts
 * 
 * Role-based access control validation
 */

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  EMPLOYEE = 'employee',
  GUEST = 'guest',
}

export interface Permission {
  resource: string;
  action: string;
}

class RBACValidator {
  private rolePermissions: Record<UserRole, Permission[]> = {
    [UserRole.SUPER_ADMIN]: [
      { resource: '*', action: '*' }, // Full access
    ],
    [UserRole.ADMIN]: [
      { resource: 'users', action: 'read' },
      { resource: 'users', action: 'create' },
      { resource: 'users', action: 'update' },
      { resource: 'reports', action: 'read' },
      { resource: 'settings', action: 'read' },
      { resource: 'settings', action: 'update' },
      { resource: 'audit', action: 'read' },
    ],
    [UserRole.MANAGER]: [
      { resource: 'employees', action: 'read' },
      { resource: 'employees', action: 'update' },
      { resource: 'reports', action: 'read' },
      { resource: 'payroll', action: 'read' },
      { resource: 'performance', action: 'read' },
    ],
    [UserRole.EMPLOYEE]: [
      { resource: 'profile', action: 'read' },
      { resource: 'profile', action: 'update' },
      { resource: 'documents', action: 'read' },
      { resource: 'attendance', action: 'read' },
    ],
    [UserRole.GUEST]: [{ resource: 'public', action: 'read' }],
  };

  hasPermission(role: UserRole, resource: string, action: string): boolean {
    const permissions = this.rolePermissions[role];
    if (!permissions) return false;

    return permissions.some(
      (perm) =>
        (perm.resource === '*' || perm.resource === resource) &&
        (perm.action === '*' || perm.action === action)
    );
  }

  canAccess(role: UserRole, resource: string): boolean {
    return this.hasPermission(role, resource, 'read');
  }

  canEdit(role: UserRole, resource: string): boolean {
    return this.hasPermission(role, resource, 'update');
  }

  canCreate(role: UserRole, resource: string): boolean {
    return this.hasPermission(role, resource, 'create');
  }

  canDelete(role: UserRole, resource: string): boolean {
    return this.hasPermission(role, resource, 'delete');
  }

  getPermissionsForRole(role: UserRole): Permission[] {
    return this.rolePermissions[role] || [];
  }
}

export default new RBACValidator();