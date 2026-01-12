import axios from 'axios';
import { API_URL } from '@/utils/Api';

export interface AlertMetadata {
  deviceBreakdown?: Array<{
    count: number;
    device: string;
  }>;
  increasePercent?: number;
  currentHourCount?: number;
  previousHourCount?: number;
  multiplier?: number;
  normalRate?: number;
  queryCount?: number;
  timeWindow?: string;
  [key: string]: any;
}

export interface AlertResponse {
  alertId: string;
  title: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'NEW' | 'ACKNOWLEDGED' | 'RESOLVED';
  category: 'PERFORMANCE' | 'RATE_LIMIT' | 'SECURITY' | 'USER_BEHAVIOR' | 'SPAM';
  message: string;
  userEmail: string | null;
  ipAddress: string | null;
  location: string | null;
  usersAffected: number;
  actionRequired: boolean;
  timestamp: string;
  updatedAt: string;
  resolvedAt: string | null;
  resolvedBy: string | null;
  metadata: AlertMetadata | null;
}

export interface AlertsListResponse {
  status: number;
  message: string;
  data: AlertResponse[];
}

// Fetch system alerts
export const fetchAlerts = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
  severity?: string;
  category?: string;
}): Promise<AlertsListResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.status) queryParams.append('status', params.status);
  if (params?.severity) queryParams.append('severity', params.severity);
  if (params?.category) queryParams.append('category', params.category);

  const response = await axios.get<AlertsListResponse>(
    `${API_URL}/admin/alerts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  );
  return response.data;
};

export interface AlertActionResponse {
  status: number;
  message: string;
  data?: any;
}

// Resolve alert
export const resolveAlert = async (alertId: string): Promise<AlertActionResponse> => {
  const response = await axios.patch<AlertActionResponse>(
    `${API_URL}/admin/alerts/${alertId}/resolve`
  );
  return response.data;
};

// Dismiss alert
export const dismissAlert = async (alertId: string): Promise<AlertActionResponse> => {
  const response = await axios.patch<AlertActionResponse>(
    `${API_URL}/admin/alerts/${alertId}/dismiss`
  );
  return response.data;
};

// Acknowledge alert
export const acknowledgeAlert = async (alertId: string): Promise<AlertActionResponse> => {
  const response = await axios.patch<AlertActionResponse>(
    `${API_URL}/admin/alerts/${alertId}/acknowledge`
  );
  return response.data;
};
