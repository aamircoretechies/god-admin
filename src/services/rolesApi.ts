import axios from 'axios';
import { API_URL } from '@/utils/Api';

// Role Interfaces
export interface Role {
  id: string;
  name: string;
  description: string | null;
  isDefault: boolean;
  memberCount: number;
  permissions: Record<string, Record<string, boolean>>;
  createdAt: string;
  updatedAt: string;
}

export interface PermissionModule {
  name: string;
  key: string;
  permissions: string[];
}

export interface AvailablePermissions {
  modules: PermissionModule[];
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
  permissions?: Record<string, Record<string, boolean>>;
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
  permissions?: Record<string, Record<string, boolean>>;
}

export interface RolesListResponse {
  status: number;
  message: string;
  data: Role[];
}

export interface RoleResponse {
  status: number;
  message: string;
  data: Role | null;
}

export interface AvailablePermissionsResponse {
  status: number;
  message: string;
  data: AvailablePermissions;
}

// Get all roles
export const fetchRoles = async (): Promise<RolesListResponse> => {
  const response = await axios.get<RolesListResponse>(`${API_URL}/admin/roles`);
  return response.data;
};

// Get role by ID
export const fetchRoleById = async (roleId: string): Promise<RoleResponse> => {
  const response = await axios.get<RoleResponse>(`${API_URL}/admin/roles/${roleId}`);
  return response.data;
};

// Create role
export const createRole = async (data: CreateRoleRequest): Promise<RoleResponse> => {
  const response = await axios.post<RoleResponse>(`${API_URL}/admin/roles`, data);
  return response.data;
};

// Update role
export const updateRole = async (roleId: string, data: UpdateRoleRequest): Promise<RoleResponse> => {
  const response = await axios.put<RoleResponse>(`${API_URL}/admin/roles/${roleId}`, data);
  return response.data;
};

// Update role permissions only
export const updateRolePermissions = async (
  roleId: string,
  permissions: Record<string, Record<string, boolean>>
): Promise<RoleResponse> => {
  const response = await axios.put<RoleResponse>(`${API_URL}/admin/roles/${roleId}/permissions`, {
    permissions
  });
  return response.data;
};

// Delete role
export const deleteRole = async (roleId: string): Promise<{ status: number; message: string }> => {
  const response = await axios.delete<{ status: number; message: string }>(`${API_URL}/admin/roles/${roleId}`);
  return response.data;
};

// Get available permissions structure
export const fetchAvailablePermissions = async (): Promise<AvailablePermissionsResponse> => {
  const response = await axios.get<AvailablePermissionsResponse>(`${API_URL}/admin/roles/permissions/available`);
  return response.data;
};
