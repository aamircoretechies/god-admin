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
  explanation_type?: string; // Used for edit/delete operations
  category: string;
  label: string;
  content: string;
  sources: string[];
  has_content: boolean;
  experience_level?: string; // e.g., "NEW_TO_BIBLE"
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
 * PUT /api/v1/admin/bible/ai-explanations/verse/:verse_id/explanation
 */
export interface UpdateAIExplanationRequest {
  explanation_type: string;
  experience_level: string;
  content: string;
  sources?: string[];
}

export interface UpdateAIExplanationResponse {
  status: number;
  message: string;
  data?: any;
}

export const updateAIExplanation = async (
  verseId: string,
  data: UpdateAIExplanationRequest
): Promise<UpdateAIExplanationResponse> => {
  const response = await axios.put<UpdateAIExplanationResponse>(
    `${API_URL}/admin/bible/ai-explanations/verse/${verseId}/explanation`,
    data
  );
  return response.data;
};

/**
 * Delete AI explanation
 * DELETE /api/v1/admin/bible/ai-explanations/verse/:verse_id/explanation
 * Query params: explanation_type, experience_level
 */
export interface DeleteAIExplanationResponse {
  status: number;
  message: string;
}

export const deleteAIExplanation = async (
  verseId: string,
  explanationType: string,
  experienceLevel: string
): Promise<DeleteAIExplanationResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.append('explanation_type', explanationType);
  queryParams.append('experience_level', experienceLevel);

  const response = await axios.delete<DeleteAIExplanationResponse>(
    `${API_URL}/admin/bible/ai-explanations/verse/${verseId}/explanation?${queryParams.toString()}`
  );
  return response.data;
};
