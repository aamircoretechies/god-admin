import axios from 'axios';
import { API_URL } from '@/utils/Api';

// Interfaces for API responses
export interface FlaggedContentResponse {
  report_id: string;
  flag_id: string;
  user_id: string;
  content_type: string;
  book: string;
  chapter: number;
  verse: number;
  version: string;
  reason: string;
  description: string;
  tags: string[];
  status: string;
  admin_notes: string | null;
  reporter: {
    user_id: string;
    email: string;
    first_name: string;
    last_name: string;
    full_name: string;
    role: string;
  };
  created_at: string;
  updated_at: string;
}

export interface FlaggedContentListResponse {
  status: number;
  message: string;
  data: FlaggedContentResponse[];
  metadata: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Fetch flagged content
export const fetchFlaggedContent = async (params: {
  page: number;
  limit: number;
  status?: string;
  content_type?: string;
  search?: string;
}): Promise<FlaggedContentListResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.append('page', String(params.page));
  queryParams.append('limit', String(params.limit));
  if (params.status) queryParams.append('status', params.status);
  if (params.content_type) queryParams.append('content_type', params.content_type);
  if (params.search) queryParams.append('search', params.search);

  const response = await axios.get<FlaggedContentListResponse>(
    `${API_URL}/admin/bible/flagged?${queryParams.toString()}`
  );

  return response.data;
};

// Update feedback status
export interface UpdateFeedbackStatusRequest {
  status: string;
  admin_notes?: string;
}

export interface UpdateFeedbackStatusResponse {
  status: number;
  message: string;
  data?: any;
}

export const updateFeedbackStatus = async (
  id: string,
  data: UpdateFeedbackStatusRequest
): Promise<UpdateFeedbackStatusResponse> => {
  const response = await axios.patch<UpdateFeedbackStatusResponse>(
    `${API_URL}/admin/bible/feedback/${id}/status`,
    data
  );
  return response.data;
};

// Approve AI response
export interface ApproveFeedbackRequest {
  admin_notes?: string;
}

export interface ApproveFeedbackResponse {
  status: number;
  message: string;
  data?: any;
}

export const approveFeedback = async (
  id: string,
  data?: ApproveFeedbackRequest
): Promise<ApproveFeedbackResponse> => {
  const response = await axios.post<ApproveFeedbackResponse>(
    `${API_URL}/admin/bible/feedback/${id}/approve`,
    data || {}
  );
  return response.data;
};

// Reject AI response
export interface RejectFeedbackRequest {
  admin_notes?: string;
  rejection_reason?: string;
}

export interface RejectFeedbackResponse {
  status: number;
  message: string;
  data?: any;
}

export const rejectFeedback = async (
  id: string,
  data?: RejectFeedbackRequest
): Promise<RejectFeedbackResponse> => {
  const response = await axios.post<RejectFeedbackResponse>(
    `${API_URL}/admin/bible/feedback/${id}/reject`,
    data || {}
  );
  return response.data;
};
