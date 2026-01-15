import { User as Auth0UserModel } from '@auth0/auth0-spa-js';

import { getData, setData } from '@/utils';
import { type AuthModel, type UserModel } from './_models';

// Use the actual localStorage key format: metronic-tailwind-react-auth-v1=9.1.1
const APP_NAME = import.meta.env.VITE_APP_NAME || 'metronic-tailwind-react';
const APP_VERSION = import.meta.env.VITE_APP_VERSION || '9.1.1';

// Try both key formats for compatibility
const AUTH_LOCAL_STORAGE_KEY = `${APP_NAME}-auth-v${APP_VERSION}`;
const AUTH_LOCAL_STORAGE_KEY_ALT = `${APP_NAME}-auth-v1=${APP_VERSION}`; // Actual format in localStorage
const USER_LOCAL_STORAGE_KEY = `${APP_NAME}-user-v${APP_VERSION}`;
const USER_LOCAL_STORAGE_KEY_ALT = `${APP_NAME}-user-v1=${APP_VERSION}`;

const getAuth = (): AuthModel | undefined => {
  try {
    // First try the alternative format (actual format in localStorage)
    let auth = getData(AUTH_LOCAL_STORAGE_KEY_ALT) as AuthModel | undefined;
    
    // If not found, try the standard format
    if (!auth || !auth.token) {
      auth = getData(AUTH_LOCAL_STORAGE_KEY) as AuthModel | undefined;
    }

    if (auth && auth.token) {
      return auth;
    }

    return undefined;
  } catch (error) {
    console.error('AUTH LOCAL STORAGE PARSE ERROR', error);
    return undefined;
  }
};

const setAuth = (auth: AuthModel | Auth0UserModel) => {
  // Store in both formats for compatibility
  setData(AUTH_LOCAL_STORAGE_KEY_ALT, auth); // Primary format (matches existing localStorage)
  setData(AUTH_LOCAL_STORAGE_KEY, auth); // Also store in standard format
};

const removeAuth = () => {
  if (!localStorage) {
    return;
  }

  try {
    // Remove both key formats
    localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY);
    localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY_ALT);
    localStorage.removeItem(USER_LOCAL_STORAGE_KEY);
    localStorage.removeItem(USER_LOCAL_STORAGE_KEY_ALT);
  } catch (error) {
    console.error('AUTH LOCAL STORAGE REMOVE ERROR', error);
  }
};

const getUser = (): UserModel | undefined => {
  try {
    const user = getData(USER_LOCAL_STORAGE_KEY) as UserModel | undefined;
    return user;
  } catch (error) {
    console.error('USER LOCAL STORAGE PARSE ERROR', error);
    return undefined;
  }
};

const setUser = (user: UserModel | undefined) => {
  if (user) {
    setData(USER_LOCAL_STORAGE_KEY, user);
  } else {
    if (localStorage) {
      try {
        localStorage.removeItem(USER_LOCAL_STORAGE_KEY);
      } catch (error) {
        console.error('USER LOCAL STORAGE REMOVE ERROR', error);
      }
    }
  }
};

export function setupAxios(axios: any) {
  axios.defaults.headers.Accept = 'application/json';

  // Request interceptor - add auth token to requests
  axios.interceptors.request.use(
    (config: any) => {
      try {
        // Ensure headers object exists
        if (!config.headers) {
          config.headers = {};
        }

        // Get auth token from localStorage
        const auth = getAuth();

        if (auth?.token && typeof auth.token === 'string' && auth.token.trim() !== '') {
          config.headers.Authorization = `Bearer ${auth.token}`;
        } else {
          // Debug logging in development
          if (import.meta.env.DEV) {
            console.warn('[Axios Interceptor] No valid auth token found');
            console.warn('[Axios Interceptor] Tried keys:', AUTH_LOCAL_STORAGE_KEY_ALT, AUTH_LOCAL_STORAGE_KEY);
            console.warn('[Axios Interceptor] Available localStorage keys:', Object.keys(localStorage).filter(k => k.includes('auth')));
          }
        }

        return config;
      } catch (error) {
        console.error('[Axios Interceptor] Error setting auth token:', error);
        return config;
      }
    },
    async (err: any) => await Promise.reject(err)
  );

  // Response interceptor - handle 401 unauthorized and 403 forbidden errors
  axios.interceptors.response.use(
    (response: any) => response,
    (error: any) => {
      // If we get a 401 (Unauthorized), clear auth and redirect to login
      if (error?.response?.status === 401) {
        // Clear auth from localStorage
        removeAuth();

        // Only redirect if we're not already on the login page
        const currentPath = window.location.pathname;
        if (!currentPath.includes('/auth/login')) {
          // Get base path from vite config or use default
          const basePath = (import.meta.env.BASE_URL || '/god-admin').replace(/\/$/, '');
          const loginPath = `${basePath}/auth/login`;
          // Force redirect to login page
          window.location.href = loginPath;
        }
      }

      // If we get a 403 (Forbidden), show proper error message
      if (error?.response?.status === 403) {
        const errorMessage = error?.response?.data?.message || 'Access forbidden. You do not have permission to perform this action.';
        // Show toast notification if available
        if (typeof window !== 'undefined' && (window as any).toast) {
          (window as any).toast.error(errorMessage);
        } else {
          console.error('Forbidden:', errorMessage);
        }
      }

      return Promise.reject(error);
    }
  );
}

export { AUTH_LOCAL_STORAGE_KEY, getAuth, removeAuth, setAuth, getUser, setUser };
