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

