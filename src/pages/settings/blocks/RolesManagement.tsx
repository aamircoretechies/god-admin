import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import {
  Users,
  Shield,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  Save,
  X,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import {
  fetchRoles,
  createRole,
  updateRole,
  deleteRole,
  type Role
} from '@/services/rolesApi';
import { usePermission, checkUserPermission } from '@/utils/permissions';
import { useAuthContext } from '@/auth';
import { DeleteUserModal } from '../../network/user-table/user-detail/blocks/DeleteUserModal';

interface RoleFormData {
  name: string;
  description: string;
}

const RolesManagement: React.FC = () => {
  const { currentUser } = useAuthContext();
  const canView = usePermission('roles_permissions', 'view');
  const canCreate = usePermission('roles_permissions', 'create');
  const canEdit = usePermission('roles_permissions', 'edit');
  const canDelete = usePermission('roles_permissions', 'delete');

  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState<RoleFormData>({
    name: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [isDeletingRole, setIsDeletingRole] = useState(false);

  const loadRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchRoles();
      if (response.status === 1 && response.data) {
        setRoles(response.data);
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

  useEffect(() => {
    if (canView) {
      loadRoles();
    } else {
      setError('You do not have permission to view roles.');
      setLoading(false);
    }
  }, [canView]);

  const handleCreateRole = async () => {
    if (!formData.name.trim()) {
      toast.error('Role name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createRole({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        permissions: {} // Start with empty permissions
      });

      if (response.status === 1) {
        toast.success('Role created successfully');
        setIsCreateDialogOpen(false);
        setFormData({ name: '', description: '' });
        await loadRoles();
      } else {
        toast.error(response.message || 'Failed to create role');
      }
    } catch (err: any) {
      console.error('Error creating role:', err);
      toast.error(err?.response?.data?.message || err?.message || 'Failed to create role');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description || ''
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateRole = async () => {
    if (!editingRole || !formData.name.trim()) {
      toast.error('Role name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await updateRole(editingRole.id, {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined
      });

      if (response.status === 1) {
        toast.success('Role updated successfully');
        setIsEditDialogOpen(false);
        setEditingRole(null);
        setFormData({ name: '', description: '' });
        await loadRoles();
      } else {
        toast.error(response.message || 'Failed to update role');
      }
    } catch (err: any) {
      console.error('Error updating role:', err);
      toast.error(err?.response?.data?.message || err?.message || 'Failed to update role');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRole = (role: Role) => {
    if (role.isDefault) {
      toast.error('Cannot delete default roles');
      return;
    }

    if (role.memberCount > 0) {
      toast.error(`Cannot delete role. ${role.memberCount} member(s) are assigned to this role.`);
      return;
    }

    setRoleToDelete(role);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!roleToDelete) return;

    try {
      setIsDeletingRole(true);
      const response = await deleteRole(roleToDelete.id);
      if (response.status === 1) {
        toast.success('Role deleted successfully');
        setIsDeleteModalOpen(false);
        setRoleToDelete(null);
        await loadRoles();
      } else {
        toast.error(response.message || 'Failed to delete role');
      }
    } catch (err: any) {
      console.error('Error deleting role:', err);
      toast.error(err?.response?.data?.message || err?.message || 'Failed to delete role');
    } finally {
      setIsDeletingRole(false);
    }
  };

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
    setFormData({ name: '', description: '' });
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingRole(null);
    setFormData({ name: '', description: '' });
  };

  return (
    <Card id="roles_management">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Roles Management
          </CardTitle>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="btn btn-sm btn-primary"
                disabled={!canCreate}
                title={!canCreate ? 'You do not have permission to create roles' : ''}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Role
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-0 shadow-2xl">
              <DialogHeader className="px-8 py-6 border-b border-gray-100 bg-white dark:bg-card">
                <div className="flex flex-col gap-1">
                  <DialogTitle className="text-xl font-bold text-gray-900 dark:text-sand tracking-tight">Create New Role</DialogTitle>
                  <DialogDescription className="text-sm text-gray-500 dark:text-white font-medium leading-relaxed">
                    Create a new role with custom permissions. You can assign permissions after creating the role.
                  </DialogDescription>
                </div>
              </DialogHeader>

              <div className="px-8 py-8 space-y-6">
                <div className="space-y-2.5 dark:bg-card">
                  <Label htmlFor="role-name" className="text-sm font-semibold text-gray-800 dark:text-white">Role Name *</Label>
                  <Input
                    id="role-name"
                    type="text"
                    placeholder="e.g., Content Moderator"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="h-11 bg-gray-50 dark:bg-gray-300 border-gray-200 dark:border-gray-700 focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all rounded-lg"
                  />
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="role-description" className="text-sm font-semibold text-gray-800 dark:text-white">Description</Label>
                  <Textarea
                    id="role-description"
                    placeholder="Describe the role's purpose and responsibilities"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="bg-gray-50 dark:bg-gray-300 border-gray-200 dark:border-gray-700 focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all rounded-lg resize-none"
                  />
                </div>
              </div>

              <div className="px-8 py-6 bg-gray-50/50 dark:bg-card border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3.5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseCreateDialog}
                  disabled={isSubmitting}
                  className="min-w-[100px] h-11 font-semibold rounded-lg hover:bg-white dark:hover:bg-gray-800  dark:hover:text-black transition-all shadow-sm active:scale-[0.98]"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleCreateRole}
                  disabled={isSubmitting}
                  className="bg-[#1b2529] hover:bg-[#1b2529]/90 dark:hover:bg-sand text-white min-w-[140px] h-11 font-bold rounded-lg shadow-[0_4px_14px_rgba(0,0,0,0.1)] transition-all active:scale-[0.98]"
                >
                  {isSubmitting ? 'Creating...' : 'Create Role'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        ) : roles.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Shield className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>No roles found</p>
            <p className="text-sm mt-1">Create your first role to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {roles.map((role) => (
              <div
                key={role.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900">{role.name}</h4>
                    {role.isDefault && (
                      <Badge variant="outline" className="text-xs">
                        Default
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {role.memberCount} {role.memberCount === 1 ? 'member' : 'members'}
                    </Badge>
                  </div>
                  {role.description && (
                    <p className="text-sm text-gray-500">{role.description}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Created: {new Date(role.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleEditRole(role)}
                      disabled={!canEdit}
                      title={!canEdit ? 'You do not have permission to edit roles' : ''}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Role
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleDeleteRole(role)}
                      disabled={!canDelete || role.isDefault || role.memberCount > 0}
                      title={!canDelete ? 'You do not have permission to delete roles' : role.isDefault ? 'Cannot delete default roles' : role.memberCount > 0 ? 'Cannot delete role with assigned members' : ''}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Role
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-0 shadow-2xl">
          <DialogHeader className="px-8 py-6 border-b border-gray-100 bg-white dark:bg-card">
            <div className="flex flex-col gap-1">
              <DialogTitle className="text-xl font-bold text-gray-900 dark:text-sand tracking-tight">Edit Role</DialogTitle>
              <DialogDescription className="text-sm text-gray-500 dark:text-white font-medium leading-relaxed">
                Update the role name and description. To manage permissions, use the Permissions Management section.
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="px-8 py-8 space-y-6">
            <div className="space-y-2.5">
              <Label htmlFor="edit-role-name" className="text-sm font-semibold text-gray-800 dark:text-white">Role Name *</Label>
              <Input
                id="edit-role-name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="h-11 bg-gray-50 dark:bg-gray-300 border-gray-200 dark:border-gray-700 focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all rounded-lg"
              />
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="edit-role-description" className="text-sm font-semibold text-gray-800 dark:text-white">Description</Label>
              <Textarea
                id="edit-role-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="bg-gray-50 dark:bg-gray-300 border-gray-200 dark:border-gray-700 focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all rounded-lg resize-none"
              />
            </div>
          </div>

          <div className="px-8 py-6 bg-card dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3.5">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseEditDialog}
              disabled={isSubmitting}
              className="min-w-[100px] h-11 font-semibold rounded-lg hover:bg-white dark:hover:bg-gray-800 dark:hover:text-black transition-all shadow-sm active:scale-[0.98]"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleUpdateRole}
              disabled={isSubmitting}
              className="bg-[#1b2529] hover:bg-[#1b2529]/90 dark:hover:bg-sand text-white min-w-[140px] h-11 font-bold rounded-lg shadow-[0_4px_14px_rgba(0,0,0,0.1)] transition-all active:scale-[0.98]"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Role Confirmation */}
      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeletingRole}
        title="Delete Role"
        description={
          <>
            Are you sure you want to delete the role <strong>"{roleToDelete?.name}"</strong>? This action <strong>cannot be undone</strong> and will permanently remove this role from the system.
          </>
        }
        confirmButtonText="Delete Role"
      />
    </Card>
  );
};

export { RolesManagement };
