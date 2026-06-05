/**
 * /frontend/src/services/security/rbacValidator.ts
 *
 * Role-based access control validation (pure service — no React).
 * Note: UserRole enum is re-defined here to avoid circular dep with auth.types.
 */

export enum RBACRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  TENANT_ADMIN = 'TENANT_ADMIN',
  MANAGER = 'MANAGER',
  HR_SPECIALIST = 'HR_SPECIALIST',
  USER = 'USER',
}

export interface RBACPermission {
  resource: string;
  action: string;
}

const ROLE_PERMISSIONS: Record<RBACRole, RBACPermission[]> = {
  [RBACRole.SUPER_ADMIN]: [{ resource: '*', action: '*' }],
  [RBACRole.TENANT_ADMIN]: [
    { resource: 'users', action: 'read' },
    { resource: 'users', action: 'create' },
    { resource: 'users', action: 'update' },
    { resource: 'reports', action: 'read' },
    { resource: 'settings', action: 'read' },
    { resource: 'settings', action: 'update' },
    { resource: 'audit', action: 'read' },
    { resource: 'billing', action: 'read' },
    { resource: 'billing', action: 'update' },
  ],
  [RBACRole.MANAGER]: [
    { resource: 'employees', action: 'read' },
    { resource: 'employees', action: 'update' },
    { resource: 'reports', action: 'read' },
    { resource: 'payroll', action: 'read' },
    { resource: 'performance', action: 'read' },
    { resource: 'performance', action: 'update' },
  ],
  [RBACRole.HR_SPECIALIST]: [
    { resource: 'employees', action: 'read' },
    { resource: 'employees', action: 'create' },
    { resource: 'employees', action: 'update' },
    { resource: 'payroll', action: 'read' },
    { resource: 'payroll', action: 'update' },
    { resource: 'benefits', action: 'read' },
    { resource: 'benefits', action: 'update' },
  ],
  [RBACRole.USER]: [
    { resource: 'profile', action: 'read' },
    { resource: 'profile', action: 'update' },
    { resource: 'documents', action: 'read' },
    { resource: 'attendance', action: 'read' },
  ],
};

class RBACValidator {
  hasPermission(role: RBACRole, resource: string, action: string): boolean {
    const perms = ROLE_PERMISSIONS[role] ?? [];
    return perms.some(
      (p) =>
        (p.resource === '*' || p.resource === resource) &&
        (p.action === '*' || p.action === action)
    );
  }

  canAccess(role: RBACRole, resource: string): boolean {
    return this.hasPermission(role, resource, 'read');
  }

  canEdit(role: RBACRole, resource: string): boolean {
    return this.hasPermission(role, resource, 'update');
  }

  canCreate(role: RBACRole, resource: string): boolean {
    return this.hasPermission(role, resource, 'create');
  }

  canDelete(role: RBACRole, resource: string): boolean {
    return this.hasPermission(role, resource, 'delete');
  }

  getPermissionsForRole(role: RBACRole): RBACPermission[] {
    return ROLE_PERMISSIONS[role] ?? [];
  }
}

export default new RBACValidator();