import axios from 'axios';
import { API_URL } from '@/utils/Api';

// Interfaces for API responses
export interface PromptResponse {
  template_id: string;
  title: string;
  description: string;
  category: string;
  target_role: string;
  language: string;
  status: string;
  version: string;
  last_updated: string;
  usage_count: number;
  tags: string[];
  is_public: boolean;
  created_at: string;
}

export interface PromptsListResponse {
  status: number;
  message: string;
  data: PromptResponse[];
}

// API call
export const fetchPrompts = async (params: {
  page: number;
  limit: number;
  category?: string;
  status?: string;
  search?: string;
  language?: string;
  target_role?: string;
}): Promise<PromptsListResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.append('page', String(params.page));
  queryParams.append('limit', String(params.limit));
  if (params.category) queryParams.append('category', params.category);
  if (params.status) queryParams.append('status', params.status);
  if (params.search) queryParams.append('search', params.search);
  if (params.language) queryParams.append('language', params.language);
  if (params.target_role) queryParams.append('target_role', params.target_role);

  const response = await axios.get<PromptsListResponse>(
    `${API_URL}/admin/prompts?${queryParams.toString()}`
  );
  return response.data;
};

// Prompt detail API response interface
export interface PromptDetailResponse {
  template_id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  target_role: string;
  language: string;
  status: string;
  version: string;
  last_updated: string;
  created_by: string;
  usage_count: number;
  tags: string[];
  is_public: boolean;
  created_at: string;
  creator?: {
    email: string;
    role: string;
  };
}

export interface PromptDetailApiResponse {
  status: number;
  message: string;
  data: PromptDetailResponse;
}

// Fetch prompt detail
export const fetchPromptDetail = async (templateId: string): Promise<PromptDetailApiResponse> => {
  // Prompt detail endpoint is at /prompts/ not /admin/prompts/
  const response = await axios.get<PromptDetailApiResponse>(
    `${API_URL}/prompts/${templateId}`
  );
  return response.data;
};

// Update prompt interface
export interface UpdatePromptRequest {
  title?: string;
  description?: string;
  content?: string;
  category?: string;
  targetRole?: string;
  language?: string;
  status?: string;
  tags?: string[];
  isPublic?: boolean;
}

// Update prompt
export const updatePrompt = async (templateId: string, data: UpdatePromptRequest): Promise<PromptDetailApiResponse> => {
  const response = await axios.patch<PromptDetailApiResponse>(
    `${API_URL}/prompts/${templateId}`,
    data
  );
  return response.data;
};

// Create prompt interface (same as update but without status)
export interface CreatePromptRequest {
  title: string;
  description: string;
  content: string;
  category: string;
  targetRole: string;
  language: string;
  tags?: string[];
  isPublic?: boolean;
}

// Create prompt
export const createPrompt = async (data: CreatePromptRequest): Promise<PromptDetailApiResponse> => {
  const response = await axios.post<PromptDetailApiResponse>(
    `${API_URL}/admin/prompts`,
    data
  );
  return response.data;
};

// Delete prompt response interface
export interface DeletePromptApiResponse {
  status: number;
  message: string;
}

// Delete prompt
export const deletePrompt = async (templateId: string): Promise<DeletePromptApiResponse> => {
  const response = await axios.delete<DeletePromptApiResponse>(
    `${API_URL}/prompts/${templateId}`
  );
  return response.data;
};

