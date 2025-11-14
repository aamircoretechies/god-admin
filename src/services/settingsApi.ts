import axios from 'axios';
import { API_URL } from '@/utils/Api';

export interface Setting {
  setting_id: string;
  key: string;
  value: string;
  description: string;
  is_sensitive: boolean;
  created_at: string;
  updated_at: string;
}

export interface SettingsResponse {
  status: number;
  message: string;
  data: {
    api: Setting[];
    cache: Setting[];
    general: Setting[];
    notifications: Setting[];
  };
}

// Fetch all settings
export const fetchSettings = async (): Promise<SettingsResponse> => {
  const response = await axios.get<SettingsResponse>(
    `${API_URL}/admin/settings`
  );
  return response.data;
};

// Update a setting
export interface UpdateSettingRequest {
  value: string;
}

export interface UpdateSettingResponse {
  status: number;
  message: string;
  data?: Setting;
}

export const updateSetting = async (
  settingId: string,
  data: UpdateSettingRequest
): Promise<UpdateSettingResponse> => {
  const response = await axios.patch<UpdateSettingResponse>(
    `${API_URL}/admin/settings/${settingId}`,
    data
  );
  return response.data;
};

// API Configuration endpoints
export interface ApiConfigurationResponse {
  status: number;
  message: string;
  data: {
    openai_api_key: string;
    bible_api_key: string;
    tts_api_key: string;
    api_rate_limit: string;
    api_timeout: string;
  };
}

export interface ApiConfigurationRequest {
  openai_api_key: string;
  bible_api_key: string;
  tts_api_key: string;
  api_rate_limit: number;
  api_timeout: number;
}

export const fetchApiConfiguration = async (): Promise<ApiConfigurationResponse> => {
  const response = await axios.get<ApiConfigurationResponse>(
    `${API_URL}/admin/settings/api/configuration`
  );
  return response.data;
};

export const updateApiConfiguration = async (
  data: ApiConfigurationRequest
): Promise<{ status: number; message: string; data: { updated: string[] } }> => {
  const response = await axios.post<{ status: number; message: string; data: { updated: string[] } }>(
    `${API_URL}/admin/settings/api/configuration`,
    data
  );
  return response.data;
};

// Cache Configuration endpoints
export interface CacheConfigurationResponse {
  status: number;
  message: string;
  data: {
    cache_enabled: boolean;
    cache_ttl: string;
    max_cache_size: string;
    offline_mode: boolean;
  };
}

export interface CacheConfigurationRequest {
  cache_enabled: boolean;
  cache_ttl: number;
  max_cache_size: string;
  offline_mode: boolean;
}

export const fetchCacheConfiguration = async (): Promise<CacheConfigurationResponse> => {
  const response = await axios.get<CacheConfigurationResponse>(
    `${API_URL}/admin/settings/cache/configuration`
  );
  return response.data;
};

export const updateCacheConfiguration = async (
  data: CacheConfigurationRequest
): Promise<{ status: number; message: string; data: { updated: string[] } }> => {
  const response = await axios.post<{ status: number; message: string; data: { updated: string[] } }>(
    `${API_URL}/admin/settings/cache/configuration`,
    data
  );
  return response.data;
};

