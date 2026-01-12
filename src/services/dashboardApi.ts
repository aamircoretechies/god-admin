import axios from 'axios';
import { API_URL } from '@/utils/Api';

// Interfaces for API responses
export interface KPIMetric {
  value: string;
  numericValue: number;
  growth: number;
  trend: 'up' | 'down';
  label: string;
  description: string;
  period: string;
}

export interface SecondaryMetric {
  value: string;
  numericValue: number;
  label: string;
  growth?: number;
}

export interface RecentUser {
  user_id: string;
  name: string;
  email: string;
  role: string;
  joinDate: string;
  lastLogin: string | null;
  status: 'active' | 'inactive';
}

export interface AnalyticsData {
  period: string;
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  totalAIQueries: number;
  dailyAIQueries: number;
  totalFlagged: number;
  totalTranslations: number;
  totalLessonsViews: number;
  totalAIExplanations: number;
}

export interface DashboardAnalyticsResponse {
  status: number;
  message: string;
  data: {
    mainKPIs: {
      totalUsers: KPIMetric;
      dailyAIQueries: KPIMetric;
      flaggedResponses: KPIMetric;
      activeTranslations: KPIMetric;
    };
    secondaryMetrics: {
      totalUsers: SecondaryMetric;
      lessonsViews: SecondaryMetric;
      newUsersToday: SecondaryMetric;
      reports: SecondaryMetric;
    };
    recentUsers: RecentUser[];
    analytics: AnalyticsData;
  };
}

// Fetch dashboard analytics
export const fetchDashboardAnalytics = async (
  period: string = '30d'
): Promise<DashboardAnalyticsResponse> => {
  const response = await axios.get<DashboardAnalyticsResponse>(
    `${API_URL}/admin/dashboard/analytics?period=${period}`
  );
  return response.data;
};

// ===== Team Members API =====

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export interface TeamMembersResponse {
  status: number;
  message: string;
  data: TeamMember[];
}

// export const fetchTeamMembers = async (): Promise<TeamMembersResponse> => {
//   const response = await axios.get<TeamMembersResponse>(
//     `${API_URL}/api/v1/users/team`
//   );
//   return response.data;
// };

export const fetchTeamMembers = async (): Promise<TeamMembersResponse> => {
  const response = await axios.get<TeamMembersResponse>(`${API_URL}/users/team`);
  return response.data;
};
