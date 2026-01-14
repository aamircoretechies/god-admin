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

// Interfaces for chapter AI explanation history
export interface ChapterExplanation {
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
  chapter_id?: string;
  chapter_reference?: string;
  chapter_number?: number;
  book?: {
    short_name: string;
    long_name: string;
    book_order: number;
  };
  [key: string]: any; // For additional fields
}

export interface ChapterAIExplanationHistoryResponse {
  status: number;
  message: string;
  data: {
    chapter_id: string;
    chapter_reference: string;
    total_explanations: number;
    explanations_with_content: number;
    explanations: ChapterExplanation[];
    metadata?: {
      book?: {
        short_name: string;
        long_name: string;
        book_order: number;
      };
      chapter_number?: number;
      all_sources?: string[];
      created_at?: string;
      experience_levels?: string[];
      explanation_types?: string[];
      [key: string]: any;
    };
  };
}

/**
 * Fetch AI explanation history for a specific chapter
 * GET /api/v1/admin/bible/ai-explanations/chapter/:chapter_id
 */
export const fetchChapterAIExplanationHistory = async (
  chapterId: string
): Promise<ChapterAIExplanationHistoryResponse> => {
  const response = await axios.get<ChapterAIExplanationHistoryResponse>(
    `${API_URL}/admin/bible/ai-explanations/chapter/${chapterId}`
  );
  return response.data;
};

/**
 * Update chapter AI explanation
 * PUT /api/v1/admin/bible/ai-explanations/chapter/:chapter_id/explanation
 */
export const updateChapterAIExplanation = async (
  chapterId: string,
  data: UpdateAIExplanationRequest
): Promise<UpdateAIExplanationResponse> => {
  const response = await axios.put<UpdateAIExplanationResponse>(
    `${API_URL}/admin/bible/ai-explanations/chapter/${chapterId}/explanation`,
    data
  );
  return response.data;
};

/**
 * Delete chapter AI explanation
 * DELETE /api/v1/admin/bible/ai-explanations/chapter/:chapter_id/explanation
 * Query params: explanation_type, experience_level
 */
export const deleteChapterAIExplanation = async (
  chapterId: string,
  explanationType: string,
  experienceLevel: string
): Promise<DeleteAIExplanationResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.append('explanation_type', explanationType);
  queryParams.append('experience_level', experienceLevel);

  const response = await axios.delete<DeleteAIExplanationResponse>(
    `${API_URL}/admin/bible/ai-explanations/chapter/${chapterId}/explanation?${queryParams.toString()}`
  );
  return response.data;
};

/**
 * Regenerate chapter AI explanation
 * POST /api/v1/admin/bible/ai-explanations/chapter/:chapter_id/regenerate
 */
export interface RegenerateChapterAIExplanationRequest {
  explanation_type: string;
  experience_level: string;
}

export interface RegenerateChapterAIExplanationResponse {
  status: number;
  message: string;
  data?: {
    chapter_id: string;
    chapter_reference: string;
    explanation_type: string;
    experience_level: string;
    content: string;
    sources: string[];
    updated_at: string;
  };
}

export const regenerateChapterAIExplanation = async (
  chapterId: string,
  data: RegenerateChapterAIExplanationRequest
): Promise<RegenerateChapterAIExplanationResponse> => {
  const response = await axios.post<RegenerateChapterAIExplanationResponse>(
    `${API_URL}/admin/bible/ai-explanations/chapter/${chapterId}/regenerate`,
    data
  );
  return response.data;
};

/**
 * Regenerate verse AI explanation
 * POST /api/v1/admin/bible/ai-explanations/verse/:verse_id/regenerate
 */
export interface RegenerateVerseAIExplanationRequest {
  explanation_type: string;
  experience_level: string;
}

export interface RegenerateVerseAIExplanationResponse {
  status: number;
  message: string;
  data?: {
    verse_id: string;
    verse_reference: string;
    explanation_type: string;
    experience_level: string;
    content: string;
    sources: string[];
    updated_at: string;
  };
}

export const regenerateVerseAIExplanation = async (
  verseId: string,
  data: RegenerateVerseAIExplanationRequest
): Promise<RegenerateVerseAIExplanationResponse> => {
  const response = await axios.post<RegenerateVerseAIExplanationResponse>(
    `${API_URL}/admin/bible/ai-explanations/verse/${verseId}/regenerate`,
    data
  );
  return response.data;
};