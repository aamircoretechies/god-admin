import axios from 'axios';
import { API_URL } from '@/utils/Api';

export interface BibleBookListItem {
  book_id: string;
  book_order: number;
  short_name: string;
  long_name: string;
  testament: string;
  total_chapters: number;
  created_at: string;
  _count: {
    chapters: number;
  };
}

export interface BibleBooksListResponse {
  status: number;
  data: BibleBookListItem[];
}

export interface Chapter {
  chapter_id: string;
  chapter_number: number;
  created_at: string;
}

export interface BibleBookDetailResponse {
  status: number;
  data: {
    book_id: string;
    book_order: number;
    short_name: string;
    long_name: string;
    testament: string;
    total_chapters: number;
    created_at: string;
    chapters: Chapter[];
  };
}

/**
 * Fetch Bible books list with pagination
 */
export const fetchBibleBooks = async (params: {
  page?: number;
  limit?: number;
}): Promise<BibleBooksListResponse> => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());

  const response = await axios.get<BibleBooksListResponse>(
    `${API_URL}/admin/bible/books?${queryParams.toString()}`
  );
  return response.data;
};

/**
 * Fetch Bible book detail with chapters
 */
export const fetchBibleBookDetail = async (bookId: string): Promise<BibleBookDetailResponse> => {
  const response = await axios.get<BibleBookDetailResponse>(
    `${API_URL}/admin/bible/books/${bookId}`
  );
  return response.data;
};

