import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Shield,
  Save,
  RefreshCw,
  AlertCircle,
  CheckSquare,
  Square
} from 'lucide-react';
import { toast } from 'sonner';
import {
  fetchRoles,
  fetchRoleById,
  fetchAvailablePermissions,
  updateRolePermissions,
  type Role,
  type PermissionModule
} from '@/services/rolesApi';
import { usePermission } from '@/utils/permissions';

const PermissionsManagement: React.FC = () => {
  const canView = usePermission('roles_permissions', 'view');
  const canEdit = usePermission('roles_permissions', 'edit');

  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [availablePermissions, setAvailablePermissions] = useState<PermissionModule[]>([]);
  const [permissions, setPermissions] = useState<Record<string, Record<string, boolean>>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchRoles();
      if (response.status === 1 && response.data) {
        setRoles(response.data);
        if (response.data.length > 0 && !selectedRoleId) {
          setSelectedRoleId(response.data[0].id);
        }
      } else {
        setError(response.message || 'Failed to load roles');
      }
    } catch (err: any) {
      console.error('Error loading roles:', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to load roles');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailablePermissions = async () => {
    try {
      const response = await fetchAvailablePermissions();
      if (response.status === 1 && response.data) {
        setAvailablePermissions(response.data.modules);
      }
    } catch (err: any) {
      console.error('Error loading available permissions:', err);
    }
  };

  const loadRolePermissions = async (roleId: string) => {
    try {
      setLoading(true);
      const response = await fetchRoleById(roleId);
      if (response.status === 1 && response.data) {
        setSelectedRole(response.data);
        setPermissions(response.data.permissions || {});
      } else {
        toast.error(response.message || 'Failed to load role permissions');
      }
    } catch (err: any) {
      console.error('Error loading role permissions:', err);
      toast.error(err?.response?.data?.message || err?.message || 'Failed to load role permissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canView) {
      loadRoles();
      loadAvailablePermissions();
    } else {
      setError('You do not have permission to view permissions.');
      setLoading(false);
    }
  }, [canView]);

  useEffect(() => {
    if (selectedRoleId) {
      loadRolePermissions(selectedRoleId);
    }
  }, [selectedRoleId]);

  const handlePermissionChange = (moduleKey: string, permission: string, value: boolean) => {
    setPermissions((prev) => {
      const newPermissions = { ...prev };
      if (!newPermissions[moduleKey]) {
        newPermissions[moduleKey] = {};
      }
      newPermissions[moduleKey] = {
        ...newPermissions[moduleKey],
        [permission]: value
      };
      return newPermissions;
    });
  };

  const handleModuleSelectAll = (moduleKey: string, modulePermissions: string[]) => {
    const allSelected = modulePermissions.every(
      (perm) => permissions[moduleKey]?.[perm] === true
    );

    setPermissions((prev) => {
      const newPermissions = { ...prev };
      if (!newPermissions[moduleKey]) {
        newPermissions[moduleKey] = {};
      }
      modulePermissions.forEach((perm) => {
        newPermissions[moduleKey][perm] = !allSelected;
      });
      return newPermissions;
    });
  };

  const handleSelectAll = () => {
    const allSelected = availablePermissions.every((module) =>
      module.permissions.every((perm) => permissions[module.key]?.[perm] === true)
    );

    const newPermissions: Record<string, Record<string, boolean>> = {};
    availablePermissions.forEach((module) => {
      newPermissions[module.key] = {};
      module.permissions.forEach((perm) => {
        newPermissions[module.key][perm] = !allSelected;
      });
    });
    setPermissions(newPermissions);
  };

  const handleSave = async () => {
    if (!selectedRoleId) {
      toast.error('Please select a role');
      return;
    }

    setSaving(true);
    try {
      const response = await updateRolePermissions(selectedRoleId, permissions);
      if (response.status === 1) {
        toast.success('Permissions updated successfully');
        await loadRolePermissions(selectedRoleId);
        await loadRoles(); // Refresh roles list to update member count if needed
      } else {
        toast.error(response.message || 'Failed to update permissions');
      }
    } catch (err: any) {
      console.error('Error updating permissions:', err);
      toast.error(err?.response?.data?.message || err?.message || 'Failed to update permissions');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (selectedRole) {
      setPermissions(selectedRole.permissions || {});
      toast.info('Permissions reset to saved values');
    }
  };

  const hasChanges = () => {
    if (!selectedRole) return false;
    return JSON.stringify(permissions) !== JSON.stringify(selectedRole.permissions || {});
  };

  if (loading && !selectedRole) {
    return (
      <Card id="permissions_management">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Permissions Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card id="permissions_management">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Permissions Management
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleSelectAll}
              disabled={!selectedRoleId || availablePermissions.length === 0}
            >
              <CheckSquare className="w-4 h-4 mr-2" />
              Select All
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleReset}
              disabled={!selectedRoleId || !hasChanges() || !canEdit}
              title={!canEdit ? 'You do not have permission to edit permissions' : ''}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!selectedRoleId || !hasChanges() || saving || !canEdit}
              title={!canEdit ? 'You do not have permission to save permissions' : ''}
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Permissions'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="w-4 h-4" />
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role-select">Select Role</Label>
            <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
              <SelectTrigger id="role-select">
                <SelectValue placeholder="Select a role to manage permissions" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                    {role.isDefault && ' (Default)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedRoleId && availablePermissions.length > 0 && (
            <div className="space-y-4 pt-4">
              {availablePermissions.map((module) => {
                const modulePermissions = permissions[module.key] || {};
                const allSelected = module.permissions.every(
                  (perm) => modulePermissions[perm] === true
                );
                const someSelected = module.permissions.some(
                  (perm) => modulePermissions[perm] === true
                );

                return (
                  <div key={module.key} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{module.name}</h4>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleModuleSelectAll(module.key, module.permissions)}
                        className="text-xs"
                      >
                        {allSelected ? (
                          <>
                            <Square className="w-3 h-3 mr-1" />
                            Deselect All
                          </>
                        ) : (
                          <>
                            <CheckSquare className="w-3 h-3 mr-1" />
                            Select All
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {module.permissions.map((permission) => (
                        <div
                          key={permission}
                          className="flex items-center justify-between p-2 rounded hover:bg-gray-50"
                        >
                          <Label
                            htmlFor={`${module.key}-${permission}`}
                            className="text-sm cursor-pointer flex-1"
                          >
                            {permission.charAt(0).toUpperCase() + permission.slice(1)}
                          </Label>
                          <Switch
                            id={`${module.key}-${permission}`}
                            checked={modulePermissions[permission] === true}
                            onCheckedChange={(checked) =>
                              handlePermissionChange(module.key, permission, checked)
                            }
                            disabled={!canEdit}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {selectedRoleId && availablePermissions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Shield className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>No permissions structure available</p>
            </div>
          )}

          {!selectedRoleId && (
            <div className="text-center py-8 text-gray-500">
              <Shield className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>Please select a role to manage permissions</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export { PermissionsManagement };
