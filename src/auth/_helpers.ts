import { User as Auth0UserModel } from '@auth0/auth0-spa-js';

import { getData, setData } from '@/utils';
import { type AuthModel, type UserModel } from './_models';

const AUTH_LOCAL_STORAGE_KEY = `${import.meta.env.VITE_APP_NAME}-auth-v${
  import.meta.env.VITE_APP_VERSION
}`;
const USER_LOCAL_STORAGE_KEY = `${import.meta.env.VITE_APP_NAME}-user-v${
  import.meta.env.VITE_APP_VERSION
}`;

const getAuth = (): AuthModel | undefined => {
  try {
    const auth = getData(AUTH_LOCAL_STORAGE_KEY) as AuthModel | undefined;

    if (auth) {
      return auth;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error('AUTH LOCAL STORAGE PARSE ERROR', error);
  }
};

const setAuth = (auth: AuthModel | Auth0UserModel) => {
  setData(AUTH_LOCAL_STORAGE_KEY, auth);
};

const removeAuth = () => {
  if (!localStorage) {
    return;
  }

  try {
    localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY);
    localStorage.removeItem(USER_LOCAL_STORAGE_KEY);
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
    (config: { headers: { Authorization: string } }) => {
      const auth = getAuth();

      if (auth?.token) {
        config.headers.Authorization = `Bearer ${auth.token}`;
      }

      return config;
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
