/**
 * API Configuration
 * Uses proxy in development to avoid CORS issues
 * In production, requires VITE_APP_API_URL environment variable to be set
 * Example: VITE_APP_API_URL=https://api.yourdomain.com/api/v1
 */
export const API_BASE_URL = import.meta.env.DEV
  ? '/api/v1'
  : import.meta.env.VITE_APP_API_URL || window.location.origin + '/api/v1';

export const API_URL = API_BASE_URL;

export const getApiUrl = (endpoint: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_URL}/${cleanEndpoint}`;
};

