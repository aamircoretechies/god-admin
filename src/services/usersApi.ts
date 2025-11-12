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
    basicInfo: {
      id: string;
      name: string;
      email: string;
      accountType: string;
      status: string;
      memberSince: string;
      lastLogin: string | null;
    };
    onboardingPreferences: Record<string, any>;
    userActivity: {
      lastLogin: string | null;
      totalSessions: number;
      pagesAccessed: number;
      versesAccessed: number;
      bookmarksCount: number;
      offlineAccess: boolean;
      interactionModes: {
        reading: boolean;
        listening: boolean;
        writing: boolean;
      };
    };
    roleAndAccess: {
      currentRole: string;
      permissions: string[];
      accessLevel: string;
      features: {
        premium: boolean;
        offline: boolean;
        analytics: boolean;
        apiAccess: boolean;
      };
    };
    subscriptionDetails: {
      plan: string;
      status: string;
      startDate: string;
      endDate: string | null;
      daysLeft: number;
      autoRenew: boolean;
      paymentMethod: string | null;
    };
    usageStats: {
      totalSessions: number;
      totalTime: number;
      versesRead: number;
      bookmarksCreated: number;
      notesCreated: number;
      lastActivity: string;
    };
    preferences: {
      language: string;
      timezone: string;
      notifications: {
        email: boolean;
        push: boolean;
        sms: boolean;
      };
      privacy: {
        profileVisibility: string;
        dataSharing: boolean;
        analytics: boolean;
      };
    };
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

