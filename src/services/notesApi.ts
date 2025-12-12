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
  username: string;
}

export interface NotesListResponse {
  status: number;
  message: string;
  data: NoteResponse[];
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



export const deleteNote = async (id: string): Promise<any> => {
  const response = await axios.delete(`${API_URL}/admin/notes/${id}`);
  return response.data;
};



// FLAG note
export const flagNote = async (id: string, reason: string) => {
  const response = await axios.post(`${API_URL}/notes/${id}/flag`,
    { reason }
  );
  return response.data;
};

// EXPORT notes
export const exportNotes = async (format: "json" | "csv", status?: string, userEmail?: string) => {
  const query = new URLSearchParams();

  query.append("format", format);
  if (status) query.append("status", status);
  if (userEmail) query.append("userEmail", userEmail);

  // important: responseType = "blob" for file download
  const response = await axios.get(`${API_URL}/notes/export?${query.toString()}`, {
    responseType: "blob"
  });

  return response;
};

