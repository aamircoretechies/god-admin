/* eslint-disable no-unused-vars */
import axios, { AxiosResponse } from 'axios';
import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  useEffect,
  useState
} from 'react';

import * as authHelper from '../_helpers';
import { type AuthModel, type UserModel, type LoginResponse } from '@/auth';
import { API_URL } from '@/utils/Api';

export const LOGIN_URL = `${API_URL}/admin/auth/login`;
export const REGISTER_URL = `${API_URL}/admin/auth/register`;
export const FORGOT_PASSWORD_URL = `${API_URL}/admin/auth/forgot-password`;
export const RESET_PASSWORD_URL = `${API_URL}/admin/auth/reset-password`;
export const VERIFY_RESET_TOKEN_URL = `${API_URL}/admin/auth/verify-reset-token`;
export const GET_USER_URL = `${API_URL}/admin/user`;

interface AuthContextProps {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  auth: AuthModel | undefined;
  saveAuth: (auth: AuthModel | undefined) => void;
  currentUser: UserModel | undefined;
  setCurrentUser: Dispatch<SetStateAction<UserModel | undefined>>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle?: () => Promise<void>;
  loginWithFacebook?: () => Promise<void>;
  loginWithGithub?: () => Promise<void>;
  register: (email: string, password: string, password_confirmation: string) => Promise<void>;
  requestPasswordResetLink: (email: string) => Promise<void>;
  changePassword: (token: string, new_password: string, confirm_password: string) => Promise<void>;
  verifyResetToken: (token: string) => Promise<{ valid: boolean; expiresAt?: string }>;
  getUser: () => Promise<AxiosResponse<any>>;
  logout: () => void;
  verify: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | null>(null);

// Helper function to validate JWT token format and expiration
const isValidToken = (token: string | undefined): boolean => {
  if (!token || typeof token !== 'string') {
    return false;
  }

  // Check JWT format (should have 3 parts separated by dots)
  const parts = token.split('.');
  if (parts.length !== 3) {
    return false;
  }

  try {
    // Decode the payload (second part)
    const payload = JSON.parse(atob(parts[1]));

    // Check if token has expiration
    if (payload.exp) {
      // Check if token is expired (exp is in seconds, Date.now() is in milliseconds)
      const expirationTime = payload.exp * 1000;
      if (Date.now() >= expirationTime) {
        return false; // Token is expired
      }
    }

    return true;
  } catch (error) {
    // If we can't decode the token, it's invalid
    return false;
  }
};

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<AuthModel | undefined>(authHelper.getAuth());
  const [currentUser, setCurrentUser] = useState<UserModel | undefined>(authHelper.getUser());

  const verify = async () => {
    // Check if auth exists and token is valid
    if (!auth || !auth.token) {
      // No auth or no token - clear everything
      saveAuth(undefined);
      setCurrentUser(undefined);
      authHelper.setUser(undefined);
      return;
    }

    // Validate token format and expiration
    if (!isValidToken(auth.token)) {
      // Token is invalid or expired - clear auth
      saveAuth(undefined);
      setCurrentUser(undefined);
      authHelper.setUser(undefined);
      return;
    }

    // Token is valid - restore user data
    // TODO: Uncomment when user API is ready
    // try {
    //   const { data: user } = await getUser();
    //   setCurrentUser(user);
    //   authHelper.setUser(user);
    // } catch {
    //   // If getUser fails, clear auth as token might be invalid
    //   saveAuth(undefined);
    //   setCurrentUser(undefined);
    //   authHelper.setUser(undefined);
    //   return;
    // }

    // For now, restore user from localStorage or use dummy data
    if (!currentUser) {
      const storedUser = authHelper.getUser();
      if (storedUser) {
        setCurrentUser(storedUser);
      } else {
        // Use dummy user data if no user is set
        const dummyUser: UserModel = {
          user_id: 'dummy-id',
          first_name: 'Admin',
          last_name: 'User',
          email: 'admin@example.com',
          role: 'ADMIN',
          created_at: new Date().toISOString(),
          last_login: null,
          auth_provider: 'EMAIL',
          firebase_uid: null,
          is_preference_setup_done: true,
          is_profile_setup_done: true,
          password_reset_expires: null,
          password_reset_token: null,
          profile_picture: null,
          voice_mode_enabled: false
        };
        setCurrentUser(dummyUser);
        authHelper.setUser(dummyUser);
      }
    }
  };

  const saveAuth = (auth: AuthModel | undefined) => {
    setAuth(auth);
    if (auth) {
      authHelper.setAuth(auth);
    } else {
      authHelper.removeAuth();
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data: response } = await axios.post<LoginResponse>(LOGIN_URL, {
        email,
        password
      });

      if (response.status === 1 && response.data) {
        const auth: AuthModel = {
          token: response.data.token,
          refreshToken: response.data.refreshToken
        };
        saveAuth(auth);
        setCurrentUser(response.data.admin);
        authHelper.setUser(response.data.admin);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      saveAuth(undefined);
      setCurrentUser(undefined);
      const errorMessage = error?.response?.data?.message || error?.message || 'Login failed';
      throw new Error(errorMessage);
    }
  };

  const register = async (email: string, password: string, password_confirmation: string) => {
    try {
      const { data: auth } = await axios.post(REGISTER_URL, {
        email,
        password,
        password_confirmation
      });
      saveAuth(auth);
      // TODO: Uncomment when user API is ready
      // const { data: user } = await getUser();
      // setCurrentUser(user);

      // For now, use dummy user data
      const dummyUser: UserModel = {
        user_id: 'dummy-id',
        first_name: 'User',
        last_name: '',
        email: email,
        role: 'USER',
        created_at: new Date().toISOString(),
        last_login: null,
        auth_provider: 'EMAIL',
        firebase_uid: null,
        is_preference_setup_done: false,
        is_profile_setup_done: false,
        password_reset_expires: null,
        password_reset_token: null,
        profile_picture: null,
        voice_mode_enabled: false
      };
      setCurrentUser(dummyUser);
    } catch (error) {
      saveAuth(undefined);
      throw new Error(`Error ${error}`);
    }
  };

  const requestPasswordResetLink = async (email: string) => {
    const response = await axios.post(FORGOT_PASSWORD_URL, {
      email
    });
    // Check response status
    if (response.data && response.data.status === 0) {
      throw new Error(response.data.message || 'Failed to send password reset email');
    }
    return response.data;
  };

  const changePassword = async (token: string, new_password: string, confirm_password: string) => {
    const response = await axios.post(RESET_PASSWORD_URL, {
      token,
      new_password,
      confirm_password
    });
    // Check response status
    if (response.data && response.data.status === 0) {
      throw new Error(response.data.message || 'Failed to reset password');
    }
    return response.data;
  };

  const verifyResetToken = async (
    token: string
  ): Promise<{ valid: boolean; expiresAt?: string }> => {
    try {
      const response = await axios.get(`${VERIFY_RESET_TOKEN_URL}/${token}`);
      if (response.data && response.data.status === 1) {
        return {
          valid: true,
          expiresAt: response.data.data?.expiresAt
        };
      }
      return { valid: false };
    } catch (error: any) {
      return { valid: false };
    }
  };

  const getUser = async () => {
    // TODO: Uncomment when user API is ready
    // return await axios.get<UserModel>(GET_USER_URL);

    // Dummy implementation for now
    return {
      data: {
        user_id: 'dummy-id',
        first_name: 'Admin',
        last_name: 'User',
        email: 'admin@example.com',
        role: 'ADMIN',
        created_at: new Date().toISOString(),
        last_login: null,
        auth_provider: 'EMAIL',
        firebase_uid: null,
        is_preference_setup_done: true,
        is_profile_setup_done: true,
        password_reset_expires: null,
        password_reset_token: null,
        profile_picture: null,
        voice_mode_enabled: false
      } as UserModel
    } as AxiosResponse<UserModel>;
  };

  const logout = () => {
    saveAuth(undefined);
    setCurrentUser(undefined);
    authHelper.setUser(undefined);
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        setLoading,
        auth,
        saveAuth,
        currentUser,
        setCurrentUser,
        login,
        register,
        requestPasswordResetLink,
        changePassword,
        verifyResetToken,
        getUser,
        logout,
        verify
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
