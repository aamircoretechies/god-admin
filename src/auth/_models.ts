import { type TLanguageCode } from '@/i18n';

export interface AuthModel {
  token: string;
  refreshToken?: string;
}

export interface UserModel {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  created_at: string;
  last_login: string | null;
  auth_provider: string;
  firebase_uid: string | null;
  is_preference_setup_done: boolean;
  is_profile_setup_done: boolean;
  password_reset_expires: string | null;
  password_reset_token: string | null;
  profile_picture: string | null;
  voice_mode_enabled: boolean;
  fullname?: string;
  occupation?: string;
  companyName?: string;
  phone?: string;
  pic?: string;
  language?: TLanguageCode;
  auth?: AuthModel;
}

export interface LoginResponse {
  status: number;
  message: string;
  data: {
    token: string;
    refreshToken: string;
    admin: UserModel;
  };
}
