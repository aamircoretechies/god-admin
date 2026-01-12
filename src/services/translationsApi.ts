import axios from 'axios';
import { API_URL } from '@/utils/Api';

export interface TranslationResponse {
  translation_id: string;
  name: string;
  abbreviation: string; // API uses 'abbreviation' instead of 'version'
  language: string;
  status: string;
  total_verses?: number; // API uses 'total_verses' instead of 'verse_count'
  last_updated?: string;
  file_size_mb?: number | null; // API uses 'file_size_mb' instead of 'file_size'
  license?: string;
  is_public?: boolean;
  is_uploaded?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TranslationsListResponse {
  success: boolean;
  data: TranslationResponse[];
  metadata?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface FetchTranslationsParams {
  page?: number;
  limit?: number;
  search?: string;
  language?: string;
  status?: string;
}

export interface UpdateTranslationRequest {
  name: string;
  abbreviation: string;
  language: string;
  license: string;
  is_public: boolean;
}

export interface UpdateTranslationResponse {
  success: boolean;
  message?: string;
  data?: TranslationResponse;
}

export const fetchTranslations = async (
  params: FetchTranslationsParams = {}
): Promise<TranslationsListResponse> => {
  const { page = 1, limit = 10, search, language, status } = params;

  const queryParams = new URLSearchParams();
  queryParams.append('page', page.toString());
  queryParams.append('limit', limit.toString());

  if (search) {
    queryParams.append('search', search);
  }
  if (language && language !== 'all') {
    queryParams.append('language', language);
  }
  if (status && status !== 'all') {
    queryParams.append('status', status);
  }

  try {
    const response = await axios.get<TranslationsListResponse>(
      `${API_URL}/admin/bible/translations?${queryParams.toString()}`,
      {
        // Prevent caching to avoid 304 responses
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache'
        }
      }
    );

    // Log response for debugging
    console.log('Translations API Response:', response);

    // API returns {success, data, metadata}
    if (!response.data || !response.data.success) {
      throw new Error('API request was not successful');
    }

    if (!response.data.data || !Array.isArray(response.data.data)) {
      throw new Error('Invalid response format from API');
    }

    return response.data;
  } catch (error: any) {
    console.error('Error fetching translations:', error);
    console.error('Response data:', error?.response?.data);
    console.error('Response status:', error?.response?.status);
    throw error;
  }
};

export interface UploadTranslationRequest {
  name: string;
  abbreviation: string;
  language: string;
  license: string;
  file: File;
}

export interface UploadTranslationResponse {
  success: boolean;
  message: string;
  data?: TranslationResponse;
}

export interface TranslationDetailData {
  overview: {
    description: string;
    publisher: string;
    year_published: string | null;
    license: string;
  };
  statistics: {
    total_verses: number;
    file_size: string;
  };
  status_configuration: {
    status: string;
    language: string;
    visibility: string;
  };
  metadata: {
    last_updated: string;
    version_code: string;
  };
  quick_actions: {
    download_file: boolean;
    upload_new_version: boolean;
    duplicate_translation: boolean;
  };
  translation_id: string;
  full_name: string;
  abbreviation: string;
  created_at: string;
}

export interface TranslationDetailResponse {
  status: number;
  message: string;
  data: TranslationDetailData;
}

export const fetchTranslationById = async (
  translationId: string
): Promise<TranslationDetailData | null> => {
  try {
    const response = await axios.get<TranslationDetailResponse>(
      `${API_URL}/admin/bible/translations/${translationId}`,
      {
        headers: {
          'Cache-Control': 'no-cache'
        }
      }
    );

    console.log('Translation detail response:', response);
    console.log('Response data:', response.data);

    // Check if response has data
    if (!response.data) {
      console.error('No response data received');
      throw new Error('No data received from server');
    }

    const responseData = response.data;

    // Check if status is 1 (success) and data exists
    if (responseData.status === 1 && responseData.data) {
      console.log('Found translation detail:', responseData.data);
      return responseData.data;
    }

    console.error('Unexpected response structure:', JSON.stringify(responseData, null, 2));
    throw new Error('Unexpected response structure from API');
  } catch (error: any) {
    console.error('Error fetching translation:', error);
    if (error?.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error?.request) {
      console.error('Request was made but no response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    throw error;
  }
};

export const updateTranslation = async (
  translationId: string,
  data: UpdateTranslationRequest
): Promise<UpdateTranslationResponse> => {
  try {
    const response = await axios.patch<UpdateTranslationResponse>(
      `${API_URL}/admin/bible/translations/${translationId}`,
      data
    );

    console.log('Update translation response:', response);

    if (!response.data || !response.data.success) {
      throw new Error('Failed to update translation');
    }

    return response.data;
  } catch (error: any) {
    console.error('Error updating translation:', error);
    console.error('Response data:', error?.response?.data);
    console.error('Response status:', error?.response?.status);
    throw error;
  }
};

export const uploadTranslation = async (
  payload: UploadTranslationRequest
): Promise<UploadTranslationResponse> => {
  try {
    const formData = new FormData();
    formData.append('name', payload.name);
    formData.append('abbreviation', payload.abbreviation);
    formData.append('language', payload.language);
    formData.append('license', payload.license);
    formData.append('file', payload.file);

    const response = await axios.post<UploadTranslationResponse>(
      `${API_URL}/admin/bible/translations/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    console.log('Upload translation response:', response);

    if (!response.data || !response.data.success) {
      throw new Error(response.data?.message || 'Upload failed');
    }

    return response.data;
  } catch (error: any) {
    console.error('Error uploading translation:', error);
    console.error('Response data:', error?.response?.data);
    console.error('Response status:', error?.response?.status);
    throw error;
  }
};
