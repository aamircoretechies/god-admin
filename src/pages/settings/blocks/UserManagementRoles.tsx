import { RolesManagement } from './RolesManagement';
import { PermissionsManagement } from './PermissionsManagement';

const UserManagementRoles = () => {
  return (
    <div id="roles_management" className="space-y-6">
      <RolesManagement />
      <PermissionsManagement />
    </div>
  );
};

export { UserManagementRoles };
