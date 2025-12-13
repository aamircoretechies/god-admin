import axios from 'axios';
import { API_URL } from '@/utils/Api';

// Interfaces for API responses
export interface ActivityLogUser {
  userId: string;
  name: string;
  email: string;
  role: string;
}

export interface ActivityLogResponse {
  log_id: string;
  user: ActivityLogUser;
  activityType: string;
  details: string;
  verseReference: string | null;
  device: string;
  location: string | null;
  ipAddress: string;
  sessionId: string;
  status: string;
  errorMessage: string | null;
  dateTime: string;
}

export interface ActivityLogsListResponse {
  status: number;
  message: string;
  data: ActivityLogResponse[];
}

// Fetch activity logs
export const fetchActivityLogs = async (params?: {
  page?: number;
  limit?: number;
  userId?: string;
  activityType?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}): Promise<ActivityLogsListResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.userId) queryParams.append('userId', params.userId);
  if (params?.activityType) queryParams.append('activityType', params.activityType);
  if (params?.status) queryParams.append('status', params.status);
  if (params?.startDate) queryParams.append('startDate', params.startDate);
  if (params?.endDate) queryParams.append('endDate', params.endDate);

  const response = await axios.get<ActivityLogsListResponse>(
    `${API_URL}/admin/activity${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  );
  return response.data;
};

// Activity Analytics Interfaces
export interface ActivityMetric {
  value: number;
  growth: number;
  trend: 'up' | 'down';
}

export interface ActivityTypeDistribution {
  type: string;
  count: number;
}

export interface TopVerse {
  verse: string;
  count: number;
}

export interface DeviceBreakdown {
  device: string;
  count: number;
  percentage: string;
}

export interface ActivityAnalyticsResponse {
  status: number;
  message: string;
  data: {
    period: {
      days: number;
      startDate: string;
      endDate: string;
    };
    metrics: {
      activeUsers: ActivityMetric;
      totalActivities: ActivityMetric;
      successRate: ActivityMetric;
      errorRate: ActivityMetric;
    };
    activityTypesDistribution: ActivityTypeDistribution[];
    dailyActiveUsers: number[];
    topVerses: TopVerse[];
    errorRateTrend: number[];
    deviceBreakdown: DeviceBreakdown[];
  };
}

// Fetch activity analytics
export const fetchActivityAnalytics = async (days: number = 7): Promise<ActivityAnalyticsResponse> => {
  const response = await axios.get<ActivityAnalyticsResponse>(
    `${API_URL}/admin/activity/analytics?days=${days}`
  );
  return response.data;
};

// User-specific activity log response (no user object since it's filtered by user)
export interface UserActivityLogResponse {
  log_id: string;
  activityType: string;
  details: string;
  verseReference: string | null;
  device: string;
  location: string | null;
  ipAddress: string;
  sessionId: string;
  status: string;
  errorMessage: string | null;
  dateTime: string;
}

export interface UserActivityLogsListResponse {
  status: number;
  message: string;
  data: UserActivityLogResponse[];
}

// Fetch user-specific activity logs
export const fetchUserActivityLogs = async (
  userId: string,
  params?: {
    page?: number;
    limit?: number;
    days?: number;
  }
): Promise<UserActivityLogsListResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.days) queryParams.append('days', params.days.toString());

  const response = await axios.get<UserActivityLogsListResponse>(
    `${API_URL}/admin/activity/user/${userId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  );
  return response.data;
};



// BLOCK user
export const blockUser = async (
  userId: string,
  reason: string,
  duration: string
) => {
  const response = await axios.post(`${API_URL}/activity/${userId}/block`,
    { reason, duration }
  );
  return response.data;
};


// SUSPEND user
export const suspendUser = async (
  userId: string,
  reason: string,
  duration: string
) => {
  console.log(" SUSPEND USER API CALL:", { userId, reason, duration });

  const response = await axios.post(`${API_URL}/activity/${userId}/suspend`,
    { reason, duration }
  );

  console.log("SUSPEND USER API RAW RESPONSE:", response);

  return response.data;
};
