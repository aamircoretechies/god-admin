import axios from 'axios';
import { API_URL } from '@/utils/Api';

// Interfaces for API responses
export interface NoteResponse {
  note_id: string;
  user_id: string;
  verse_id: string | null;
  reflection_id: string | null;
  content: string;
  emotion_tags: string[];
  created_at: string;
  updated_at: string;
}

export interface NotesListResponse {
  success: boolean;
  data: NoteResponse[];
  metadata: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Fetch notes
export const fetchNotes = async (params: {
  page: number;
  limit: number;
  search?: string;
  user_id?: string;
}): Promise<NotesListResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.append('page', String(params.page));
  queryParams.append('limit', String(params.limit));
  if (params.search) queryParams.append('search', params.search);
  if (params.user_id) queryParams.append('user_id', params.user_id);

  const response = await axios.get<NotesListResponse>(
    `${API_URL}/admin/notes?${queryParams.toString()}`
  );
  return response.data;
};

