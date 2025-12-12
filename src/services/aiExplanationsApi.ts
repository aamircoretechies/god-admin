
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

// Interfaces for verse AI explanation history
export interface VerseExplanation {
  explanation_id: string;
  context_type: string;
  category: string;
  label: string;
  content: string;
  sources: string[];
  has_content: boolean;
  created_at?: string;
  updated_at?: string;
  [key: string]: any; // For additional fields
}

export interface VerseAIExplanationHistoryResponse {
  status: number;
  message: string;
  data: {
    verse_id: string;
    verse_reference: string;
    verse_text: string;
    total_explanations: number;
    explanations_with_content: number;
    explanations: VerseExplanation[];
    metadata?: {
      [key: string]: any;
    };
  };
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

/**
 * Fetch AI explanation history for a specific verse
 * GET /api/v1/admin/bible/ai-explanations/verse/:verse_id
 */
export const fetchVerseAIExplanationHistory = async (
  verseId: string
): Promise<VerseAIExplanationHistoryResponse> => {
  const response = await axios.get<VerseAIExplanationHistoryResponse>(
    `${API_URL}/admin/bible/ai-explanations/verse/${verseId}`
  );
  return response.data;
};

/**
 * Update AI explanation
 * PATCH /api/v1/admin/bible/ai-explanations/{id}
 */
export const updateAIExplanation = async (
  id: string,
  data: { verse_text: string; explanation: string; status: string; }
) => {
  const response = await axios.patch(`${API_URL}/admin/bible/ai-explanations/${id}`, data);
  return response.data;
};

/**
 * Delete AI explanation
 * DELETE /api/v1/admin/bible/ai-explanations/{id}
 */
export const deleteAIExplanation = async (id: string) => {
  const response = await axios.delete(`${API_URL}/admin/bible/ai-explanations/${id}`);
  return response.data;
};

