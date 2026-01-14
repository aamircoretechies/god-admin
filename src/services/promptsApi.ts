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
  metadata?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
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
  const response = await axios.get<PromptDetailApiResponse>(`${API_URL}/prompts/${templateId}`);
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
export const updatePrompt = async (
  templateId: string,
  data: UpdatePromptRequest
): Promise<PromptDetailApiResponse> => {
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
  const response = await axios.post<PromptDetailApiResponse>(`${API_URL}/admin/prompts`, data);
  return response.data;
};

// Delete prompt response interface
export interface DeletePromptApiResponse {
  status: number;
  message: string;
}

// Delete prompt
export const deletePrompt = async (templateId: string): Promise<DeletePromptApiResponse> => {
  const response = await axios.delete<DeletePromptApiResponse>(`${API_URL}/prompts/${templateId}`);
  return response.data;
};

// Update prompt status interface
export interface UpdatePromptStatusRequest {
  status: string;
}

// Update prompt status response interface
export interface UpdatePromptStatusResponse {
  status: number;
  message: string;
  data?: PromptResponse;
}

// Update prompt status (for activate/deactivate)
export const updatePromptStatus = async (
  templateId: string,
  status: 'Active' | 'Inactive'
): Promise<UpdatePromptStatusResponse> => {
  const response = await axios.patch<UpdatePromptStatusResponse>(
    `${API_URL}/admin/prompts/${templateId}`,
    { status }
  );
  return response.data;
};

// Source Filter Interfaces
export interface SourceOption {
  value: string;
  label: string;
}

export interface SourceFilter {
  filter_id: string;
  sources: string[];
  custom_sources: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface SourceFiltersResponse {
  status: number;
  message: string;
  data: {
    template_id: string;
    whitelist: SourceFilter | null;
    blacklist: SourceFilter | null;
  };
}

export interface SourceOptionsResponse {
  status: number;
  message: string;
  data: SourceOption[];
}

export interface UpsertSourceFilterRequest {
  filter_type: 'whitelist' | 'blacklist';
  sources: string[];
  custom_sources?: string[];
  notes?: string;
}

export interface UpsertSourceFilterResponse {
  status: number;
  message: string;
  data: SourceFilter;
}

export interface DeleteSourceFilterResponse {
  status: number;
  message: string;
}

// Get source options
export const fetchSourceOptions = async (): Promise<SourceOptionsResponse> => {
  const response = await axios.get<SourceOptionsResponse>(
    `${API_URL}/admin/prompts/source-options`
  );
  return response.data;
};

// Get source filters for a prompt template
export const fetchSourceFilters = async (templateId: string): Promise<SourceFiltersResponse> => {
  const response = await axios.get<SourceFiltersResponse>(
    `${API_URL}/admin/prompts/${templateId}/source-filters`
  );
  return response.data;
};

// Create or update source filter
export const upsertSourceFilter = async (
  templateId: string,
  data: UpsertSourceFilterRequest
): Promise<UpsertSourceFilterResponse> => {
  const response = await axios.post<UpsertSourceFilterResponse>(
    `${API_URL}/admin/prompts/${templateId}/source-filters`,
    data
  );
  return response.data;
};

// Delete source filter
export const deleteSourceFilter = async (
  templateId: string,
  filterType: 'whitelist' | 'blacklist'
): Promise<DeleteSourceFilterResponse> => {
  const response = await axios.delete<DeleteSourceFilterResponse>(
    `${API_URL}/admin/prompts/${templateId}/source-filters/${filterType}`
  );
  return response.data;
};