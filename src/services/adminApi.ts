import axios from 'axios';
import { API_URL } from '@/utils/Api';

// Admin Profile Interfaces
export interface AdminProfile {
  user_id: string;
  email: string;
  role: string;
  first_name: string | null;
  last_name: string | null;
  profile_picture: string | null;
  phone: string | null;
  created_at: string;
  last_login: string | null;
}

export interface AdminProfileResponse {
  status: number;
  message: string;
  data: AdminProfile | null;
}

export interface UpdateAdminProfileRequest {
  email?: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
}

export interface UpdateAdminProfileResponse {
  status: number;
  message: string;
  data: AdminProfile | null;
}

export interface UpdateProfilePictureResponse {
  status: number;
  message: string;
  data: {
    user: {
      user_id: string;
      first_name: string | null;
      last_name: string | null;
      email: string;
      profile_picture: string | null;
    };
    file_info: {
      filename: string;
      originalname: string;
      size: number;
      mimetype: string;
    };
  } | null;
}

/**
 * Get admin profile
 */
export const getAdminProfile = async (): Promise<AdminProfileResponse> => {
  const response = await axios.get<AdminProfileResponse>(`${API_URL}/admin/profile`);
  return response.data;
};

/**
 * Update admin profile
 */
export const updateAdminProfile = async (
  data: UpdateAdminProfileRequest
): Promise<UpdateAdminProfileResponse> => {
  const response = await axios.put<UpdateAdminProfileResponse>(
    `${API_URL}/admin/profile`,
    data
  );
  return response.data;
};

/**
 * Update admin profile picture
 */
export const updateAdminProfilePicture = async (
  file: File
): Promise<UpdateProfilePictureResponse> => {
  const formData = new FormData();
  formData.append('profile_picture', file);

  const response = await axios.put<UpdateProfilePictureResponse>(
    `${API_URL}/admin/profile/picture`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};
