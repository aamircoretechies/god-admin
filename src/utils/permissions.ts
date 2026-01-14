import { useAuthContext } from '@/auth';
import type { UserModel } from '@/auth';

export type PermissionModule = 
  | 'user_management'
  | 'team_members'
  | 'roles_permissions'
  | 'bible_content'
  | 'ai_explanations'
  | 'ai_prompts'
  | 'system_logs'
  | 'settings'
  | 'dashboard'
  | 'activity_logs';

export type PermissionAction = 
  | 'view'
  | 'create'
  | 'edit'
  | 'delete'
  | 'export'
  | 'regenerate'
  | 'configure'
  | 'publish'
  | 'assign_role'
  | 'modify';

/**
 * Check if a user has a specific permission
 * @param user - The user object
 * @param moduleKey - The module key (e.g., 'roles_permissions', 'team_members')
 * @param permission - The permission name (e.g., 'create', 'edit', 'delete', 'view')
 * @returns boolean - true if user has permission, false otherwise
 */
export const checkUserPermission = (
  user: UserModel | undefined | null,
  moduleKey: PermissionModule,
  permission: PermissionAction
): boolean => {
  try {
    if (!user) {
      return false;
    }

    // Super admin (ADMIN enum role) has all permissions
    if (user.role === 'ADMIN') {
      return true;
    }

    // Check custom roles for permissions
    const customRoles = (user as any).custom_roles || [];
    if (customRoles.length === 0) {
      return false;
    }

    // Check if any of the user's roles has the required permission
    for (const customRole of customRoles) {
      if (customRole.permissions && typeof customRole.permissions === 'object') {
        const modulePermissions = customRole.permissions[moduleKey];
        if (modulePermissions && modulePermissions[permission] === true) {
          return true;
        }
      }
    }

    return false;
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
};

/**
 * Hook to check if current user has a specific permission
 * @param moduleKey - The module key
 * @param permission - The permission name
 * @returns boolean - true if user has permission
 */
export const usePermission = (
  moduleKey: PermissionModule,
  permission: PermissionAction
): boolean => {
  const { currentUser } = useAuthContext();
  return checkUserPermission(currentUser, moduleKey, permission);
};

/**
 * Check if user has any of the specified permissions
 * @param user - The user object
 * @param moduleKey - The module key
 * @param permissions - Array of permission names (user needs at least one)
 * @returns boolean - true if user has at least one permission
 */
export const checkUserAnyPermission = (
  user: UserModel | undefined | null,
  moduleKey: PermissionModule,
  permissions: PermissionAction[]
): boolean => {
  try {
    if (!user) {
      return false;
    }

    // Super admin (ADMIN enum role) has all permissions
    if (user.role === 'ADMIN') {
      return true;
    }

    // Check custom roles for permissions
    const customRoles = (user as any).custom_roles || [];
    if (customRoles.length === 0) {
      return false;
    }

    // Check if any of the user's roles has any of the required permissions
    for (const customRole of customRoles) {
      if (customRole.permissions && typeof customRole.permissions === 'object') {
        const modulePermissions = customRole.permissions[moduleKey];
        if (modulePermissions) {
          for (const permission of permissions) {
            if (modulePermissions[permission] === true) {
              return true;
            }
          }
        }
      }
    }

    return false;
  } catch (error) {
    console.error('Error checking permissions:', error);
    return false;
  }
};

/**
 * Get all permissions for a specific module for a user
 * @param user - The user object
 * @param moduleKey - The module key
 * @returns Record<string, boolean> - Object with permission names as keys and boolean values
 */
export const getUserModulePermissions = (
  user: UserModel | undefined | null,
  moduleKey: PermissionModule
): Record<string, boolean> => {
  try {
    if (!user) {
      return {};
    }

    // Super admin (ADMIN enum role) has all permissions
    if (user.role === 'ADMIN') {
      // Return all permissions as true for admin
      return {
        view: true,
        create: true,
        edit: true,
        delete: true,
        export: true,
        regenerate: true,
        configure: true,
        publish: true,
        assign_role: true,
        modify: true
      };
    }

    // Check custom roles for permissions
    const customRoles = (user as any).custom_roles || [];
    if (customRoles.length === 0) {
      return {};
    }

    // Merge permissions from all roles (OR logic - if any role has permission, user has it)
    const mergedPermissions: Record<string, boolean> = {};
    
    for (const customRole of customRoles) {
      if (customRole.permissions && typeof customRole.permissions === 'object') {
        const modulePermissions = customRole.permissions[moduleKey];
        if (modulePermissions && typeof modulePermissions === 'object') {
          Object.keys(modulePermissions).forEach((key) => {
            if (modulePermissions[key] === true) {
              mergedPermissions[key] = true;
            }
          });
        }
      }
    }

    return mergedPermissions;
  } catch (error) {
    console.error('Error getting module permissions:', error);
    return {};
  }
};
