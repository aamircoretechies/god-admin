import axios from 'axios';
import { API_URL } from '@/utils/Api';
import { TDataGridRequestParams } from '@/components/data-grid';

export interface UserListItem {
  id: string;
  name: string;
  email: string;
  created_at: string;
  last_login: string | null;
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
      platform?: string;
      appVersion?: string;
      lastSyncTimestamp?: string | null;
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
}): Promise<UsersListResponse> => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

  const response = await axios.get<UsersListResponse>(
    `${API_URL}/users?${queryParams.toString()}`
  );
  return response.data;
};

/**
 * Fetch user profile by ID
 */
export const fetchUserProfile = async (userId: string): Promise<UserProfileResponse> => {
  const response = await axios.get<UserProfileResponse>(
    `${API_URL}/users/${userId}/profile`
  );
  return response.data;
};

/**
 * Transform API user data to match UI format
 */
export const transformUserData = (user: UserListItem): TransformedUserData => {
  // Generate a random avatar from available avatars
  const avatarNumber = Math.floor(Math.random() * 34) + 1;
  const avatar = `300-${avatarNumber}.png`;

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
  params: TDataGridRequestParams
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

  const response = await fetchUsers({
    page,
    limit: pageSize,
    sortBy,
    sortOrder
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
  password: string;
  first_name: string;
  last_name: string;
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
  const response = await axios.post<CreateTeamMemberResponse>(
    `${API_URL}/users`,
    data
  );
  return response.data;
};

/**
 * Fetch admin-created users (team members) with pagination
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

