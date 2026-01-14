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

/**
 * Get the backend base URL for serving static files (uploads, etc.)
 * Uses VITE_APP_API_URL to determine the backend URL, or falls back to defaults
 */
export const getBackendBaseUrl = (): string => {
  // If VITE_APP_API_URL is set, extract the base URL from it
  if (import.meta.env.VITE_APP_API_URL) {
    try {
      const apiUrl = import.meta.env.VITE_APP_API_URL;
      // Remove /api/v1 or /api from the end if present
      const baseUrl = apiUrl.replace(/\/api\/v1?\/?$/, '');
      return baseUrl || window.location.origin;
    } catch (error) {
      console.warn('Error parsing VITE_APP_API_URL:', error);
    }
  }
  
  if (import.meta.env.DEV) {
    // In development, check for VITE_APP_BACKEND_URL or default to localhost:3000
    return import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:3000';
  }
  
  // In production, use the same origin as the API
  return window.location.origin;
};

/**
 * Get the full URL for a profile picture or other uploaded file
 * @param path - The file path (e.g., '/uploads/profile-pictures/filename.webp')
 * @returns The full URL to access the file
 */
export const getUploadedFileUrl = (path: string | null | undefined): string => {
  if (!path) return '';
  // If path starts with /uploads, it's from the backend
  if (path.startsWith('/uploads')) {
    return `${getBackendBaseUrl()}${path}`;
  }
  // Otherwise, treat as relative path (for local assets)
  return path;
};