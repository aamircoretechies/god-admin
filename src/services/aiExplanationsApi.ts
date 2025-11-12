import axios from 'axios';
import { API_URL } from '@/utils/Api';

// Interfaces for API responses
export interface AIExplanationResponse {
  explanation_id: string;
  verse_ref: string;
  content: string;
  context_type: string;
  field_name: string;
  category: string;
  status: string;
  created_at: string;
  updated_at: string;
  ai_generated: boolean;
  reviewed_by: string | null;
  translation: {
    full_name: string;
    abbreviation: string;
  };
  verse: {
    verse_id: string;
    book: string;
    chapter: number;
    verse: number;
  };
}

export interface AIExplanationsListResponse {
  status: number;
  message: string;
  data: AIExplanationResponse[];
}

// API call
export const fetchAIExplanations = async (params: {
  page: number;
  limit: number;
  status?: string;
  category?: string;
  search?: string;
}): Promise<AIExplanationsListResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.append('page', String(params.page));
  queryParams.append('limit', String(params.limit));
  if (params.status) queryParams.append('status', params.status);
  if (params.category) queryParams.append('category', params.category);
  if (params.search) queryParams.append('search', params.search);

  const response = await axios.get<AIExplanationsListResponse>(
    `${API_URL}/admin/bible/ai-explanations?${queryParams.toString()}`
  );
  return response.data;
};

