import axios from 'axios';
import { API_URL, getUploadedFileUrl } from '@/utils/Api';
import { TDataGridRequestParams } from '@/components/data-grid';

export interface UserListItem {
  id: string;
  name: string;
  email: string;
  created_at: string;
  last_login: string | null;
  avatar?: string;
}

export interface UsersListResponse {
  status: number;
  message: string;
  data: {
    users: UserListItem[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface UserProfileResponse {
  status: number;
  message: string;
  data: {
    basicUserInfo: {
      userId: string;
      fullName: string;
      email: string;
      memberSince: string;
      accountType: string;
      status: string;
      profile_picture?: string;
      phoneNumber?: string;
      address?: string;
    };
    onboardingPreferences: {
      experienceAndPurpose?: {
        bibleExperienceLevel?: string;
        reasonForUsingApp?: string;
      };
      engagementAndStyle?: {
        engagementMode?: string;
        explanationStyle?: string;
      };
      preferences?: {
        bibleTranslation?: string;
        language?: string;
      };
      dailyHabits?: {
        dailyVerse?: string;
        reflectionLength?: string;
      };
      customNote?: string;
    };
    userActivity: {
      basicActivityStats: {
        lastLoginDate: string | null;
        totalSessions: number;
        pagesVersesAccessed: number;
      };
      contentEngagement: {
        bookmarksFavoritesCount: number;
        dailyVerseSubscriptionStatus: string;
        offlineAccessUsage: string | null;
      };
    };
    roleAndAccess: {
      currentRole: string;
      basicPermissionsList: string[];
      restrictions: string[];
    };
    technicalInfo?: {
      deviceModel?: string;
      osVersion?: string;
      appVersion?: string;
      ipAddress?: string;
      location?: string;
      lastSyncTimestamp?: string | null;
      devicesUsed?: string[];
      platform?: string; // Legacy field
    } | null;
  };
}

export interface TransformedUserData {
  id: string;
  user: {
    avatar: string;
    name: string;
    email: string;
  };
  joinDate?: string;
  labels?: string[];
  license?: {
    type: string;
    left: string;
  };
  payment?: string;
  enforce?: boolean;
  isDummy?: boolean;
}

/**
 * Fetch users list with pagination and sorting
 */
export const fetchUsers = async (params: {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  status?: string;
}): Promise<UsersListResponse> => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
  if (params.search) queryParams.append('search', params.search);
  if (params.status && params.status !== 'all') queryParams.append('status', params.status);

  const response = await axios.get<UsersListResponse>(`${API_URL}/users?${queryParams.toString()}`);
  return response.data;
};

/**
 * Fetch user profile by ID
 */
export const fetchUserProfile = async (userId: string): Promise<UserProfileResponse> => {
  // Try admin endpoint first, fallback to regular endpoint
  const adminUrl = `${API_URL}/admin/users/${userId}/profile`;
  const userUrl = `${API_URL}/users/${userId}/profile`;

  try {
    const response = await axios.get<UserProfileResponse>(adminUrl);
    return response.data;
  } catch (error) {
    // Fallback to regular endpoint if admin endpoint fails
    const response = await axios.get<UserProfileResponse>(userUrl);
    return response.data;
  }
};

/**
 * Transform API user data to match UI format
 */
export const transformUserData = (user: UserListItem): TransformedUserData => {
  // Use real avatar if available, otherwise fallback to random
  let avatar: string;

  if (user.avatar) {
    avatar = getUploadedFileUrl(user.avatar);
  } else {
    // Generate a random avatar from available avatars
    const avatarNumber = Math.floor(Math.random() * 34) + 1;
    avatar = `300-${avatarNumber}.png`;
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return {
    id: user.id,
    user: {
      avatar,
      name: user.name,
      email: user.email
    },
    joinDate: formatDate(user.created_at),
    // These fields are not in API response - marked as dummy
    labels: undefined, // Dummy field
    license: undefined, // Dummy field
    payment: undefined, // Dummy field
    enforce: undefined // Dummy field
  };
};

/**
 * Fetch users for DataGrid with server-side support
 */
export const fetchUsersForDataGrid = async (
  params: TDataGridRequestParams,
  searchTerm?: string,
  statusFilter?: string,
  sortFilter?: string
): Promise<{ data: TransformedUserData[]; totalCount: number }> => {
  const page = params.pageIndex + 1; // API uses 1-based pagination
  const pageSize = params.pageSize || 10;

  // Map sorting
  let sortBy = 'joinedAt';
  let sortOrder: 'asc' | 'desc' = 'desc';

  if (params.sorting && params.sorting.length > 0) {
    const sort = params.sorting[0];
    if (sort.id === 'joinDate') {
      sortBy = 'joinedAt';
    } else if (sort.id === 'user') {
      sortBy = 'name';
    }
    sortOrder = sort.desc ? 'desc' : 'asc';
  }

  // Handle sort filter from UI
  if (sortFilter === 'oldest') {
    sortOrder = 'asc';
    sortBy = 'joinedAt';
  } else if (sortFilter === 'latest') {
    sortOrder = 'desc';
    sortBy = 'joinedAt';
  } else if (sortFilter === 'older') {
    sortOrder = 'desc';
    sortBy = 'joinedAt';
  }

  const response = await fetchUsers({
    page,
    limit: pageSize,
    sortBy,
    sortOrder,
    search: searchTerm,
    status: statusFilter
  });

  const transformedData = response.data.users.map(transformUserData);
  const totalCount = response.data.pagination?.total || response.data.users.length;

  return {
    data: transformedData,
    totalCount
  };
};

// Team Members API Types
export interface CustomRole {
  role_id: string;
  role_name: string;
  description?: string;
  permissions: {
    users?: {
      edit: boolean;
      view: boolean;
      delete: boolean;
    };
    content?: {
      edit: boolean;
      delete: boolean;
      moderate: boolean;
    };
    settings?: {
      view: boolean;
      modify: boolean;
    };
  };
  assigned_at?: string;
  is_active?: boolean;
}

export interface TeamMember {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  custom_roles: CustomRole[];
  created_at: string;
  last_login: string | null;
}

export interface CreateTeamMemberRequest {
  email: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  role: string;
  custom_role_id?: string;
}

export interface CreateTeamMemberResponse {
  status: number;
  message: string;
  data: {
    user_id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    custom_roles: CustomRole[];
    created_at: string;
  };
}

export interface AdminCreatedUsersResponse {
  status: number;
  message: string;
  data: {
    users: TeamMember[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

/**
 * Create a new team member (admin-created user)
 */
export const createTeamMember = async (
  data: CreateTeamMemberRequest
): Promise<CreateTeamMemberResponse> => {
  const response = await axios.post<CreateTeamMemberResponse>(`${API_URL}/users`, data);
  return response.data;
};

/**
 * Fetch admin-created users (team members) with pagination
 * Uses existing /users/user-db endpoint
 */
export const fetchAdminCreatedUsers = async (params: {
  page?: number;
  limit?: number;
}): Promise<AdminCreatedUsersResponse> => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());

  const response = await axios.get<AdminCreatedUsersResponse>(
    `${API_URL}/users/user-db?${queryParams.toString()}`
  );
  return response.data;
};

// Export User Data API
export interface ExportUserDataResponse {
  status: number;
  message: string;
  data: {
    exportDate: string;
    user: {
      userId: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
      createdAt: string;
      lastLogin: string;
    };
    preferences?: any;
    subscriptions?: any;
    bookmarks?: any[];
    notes?: any[];
    activityLogs?: any[];
    dailyVerses?: any[];
  } | null;
}

export const exportUserData = async (
  userId: string,
  format: 'json' | 'csv' = 'json'
): Promise<ExportUserDataResponse> => {
  const response = await axios.get<ExportUserDataResponse>(
    `${API_URL}/admin/users/${userId}/export?format=${format}`
  );
  return response.data;
};

// Update User Profile API
export interface UpdateUserProfileRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: string;
}

export interface UpdateUserProfileResponse {
  status: number;
  message: string;
  data: {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    created_at: string;
    last_login: string | null;
  } | null;
}

export const updateUserProfile = async (
  userId: string,
  data: UpdateUserProfileRequest
): Promise<UpdateUserProfileResponse> => {
  const response = await axios.put<UpdateUserProfileResponse>(
    `${API_URL}/admin/users/${userId}/profile`,
    data
  );
  return response.data;
};

// Delete User API
export interface DeleteUserResponse {
  status: number;
  message: string;
  data: null;
}

export const deleteUser = async (userId: string): Promise<DeleteUserResponse> => {
  const response = await axios.delete<DeleteUserResponse>(
    `${API_URL}/admin/users/${userId}`
  );
  return response.data;
};

// Share Team Member API
export interface ShareTeamMemberRequest {
  email?: string;
  permissions?: string[];
}

export interface ShareTeamMemberResponse {
  status: number;
  message: string;
  data: {
    shareToken: string;
    shareUrl: string;
    expiresAt: string;
  } | null;
}

/**
 * Share team member
 * POST /users/team/:id/share
 */
export const shareTeamMember = async (
  teamMemberId: string,
  data?: ShareTeamMemberRequest
): Promise<ShareTeamMemberResponse> => {
  const response = await axios.post<ShareTeamMemberResponse>(
    `${API_URL}/users/team/${teamMemberId}/share`,
    data || {}
  );
  return response.data;
};

// Report Team Member API
export interface ReportTeamMemberRequest {
  reason?: string;
  description?: string;
}

export interface ReportTeamMemberResponse {
  status: number;
  message: string;
  data: {
    reportId: string;
    teamMemberId: string;
    teamMemberEmail: string;
    reason: string;
    description: string;
    reportedBy: string;
    reportedAt: string;
  } | null;
}

/**
 * Report team member
 * POST /users/team/:id/report
 */
export const reportTeamMember = async (
  teamMemberId: string,
  data: ReportTeamMemberRequest
): Promise<ReportTeamMemberResponse> => {
  const response = await axios.post<ReportTeamMemberResponse>(
    `${API_URL}/users/team/${teamMemberId}/report`,
    data
  );
  return response.data;
};

// Import Team Members API
export interface ImportTeamMember {
  email: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  role?: 'FREE' | 'PREMIUM' | 'ADMIN';
  custom_role_id?: string;
}

export interface ImportTeamMembersRequest {
  members: ImportTeamMember[];
}

export interface ImportTeamMembersResponse {
  status: number;
  message: string;
  data: {
    success: Array<{
      user_id: string;
      email: string;
      role: string;
    }>;
    failed: Array<{
      email: string;
      reason: string;
    }>;
    skipped: Array<{
      email: string;
      reason: string;
    }>;
  } | null;
}

/**
 * Import team members
 * POST /users/team/import
 */
export const importTeamMembers = async (
  data: ImportTeamMembersRequest
): Promise<ImportTeamMembersResponse> => {
  const response = await axios.post<ImportTeamMembersResponse>(
    `${API_URL}/users/team/import`,
    data
  );
  return response.data;
};

// Delete Team Member API
export interface DeleteTeamMemberResponse {
  status: number;
  message: string;
  data?: {
    deleted: boolean;
    userId: string;
  } | null;
}

/**
 * Delete single team member
 * DELETE /users/team/:id
 */
export const deleteTeamMember = async (teamMemberId: string): Promise<DeleteTeamMemberResponse> => {
  const response = await axios.delete<DeleteTeamMemberResponse>(
    `${API_URL}/users/team/${teamMemberId}`
  );
  return response.data;
};

// Delete Multiple Team Members API
export interface DeleteMultipleTeamMembersResponse {
  status: number;
  message: string;
  data?: {
    deleted: number;
    failed: number;
    userIds: string[];
  } | null;
}

/**
 * Delete multiple team members
 * POST /users/team/delete-multiple
 */
export const deleteMultipleTeamMembers = async (
  teamMemberIds: string[]
): Promise<DeleteMultipleTeamMembersResponse> => {
  const response = await axios.post<DeleteMultipleTeamMembersResponse>(
    `${API_URL}/users/team/delete-multiple`,
    { userIds: teamMemberIds }
  );
  return response.data;
};

// Get Available Roles API
export interface Role {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
  memberCount: number;
  permissions: {
    users?: {
      edit?: boolean;
      view?: boolean;
      delete?: boolean;
    };
    content?: {
      edit?: boolean;
      delete?: boolean;
      moderate?: boolean;
    };
    settings?: {
      view?: boolean;
      modify?: boolean;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface GetRolesResponse {
  status: number;
  message: string;
  data: Role[];
}

/**
 * Get available roles
 * GET /admin/roles
 */
export const getAvailableRoles = async (): Promise<GetRolesResponse> => {
  const response = await axios.get<GetRolesResponse>(`${API_URL}/admin/roles`);
  return response.data;
};
