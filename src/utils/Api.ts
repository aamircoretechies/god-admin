/**
 * API Configuration
 * Uses proxy in development to avoid CORS issues
 * For now, using localhost:3000 for all environments
 */
export const API_BASE_URL = import.meta.env.DEV 
  ? '/api/v1' 
  : (import.meta.env.VITE_APP_API_URL || 'http://localhost:3000/api/v1');

export const API_URL = API_BASE_URL;

export const getApiUrl = (endpoint: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_URL}/${cleanEndpoint}`;
};

