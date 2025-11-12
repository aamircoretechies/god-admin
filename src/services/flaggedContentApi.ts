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

