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
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
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
  translation?: string; // Translation code like 'KJV', 'SV'
}): Promise<BibleBooksListResponse> => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.translation) queryParams.append('translation', params.translation);

  const response = await axios.get<BibleBooksListResponse>(
    `${API_URL}/admin/bible/books?${queryParams.toString()}`
  );
  return response.data;
};

/**
 * Fetch Bible book detail with chapters
 */
export const fetchBibleBookDetail = async (
  bookId: string,
  translation?: string
): Promise<BibleBookDetailResponse> => {
  const queryParams = new URLSearchParams();
  if (translation) queryParams.append('translation', translation);

  const url = translation
    ? `${API_URL}/admin/bible/books/${bookId}?${queryParams.toString()}`
    : `${API_URL}/admin/bible/books/${bookId}`;

  const response = await axios.get<BibleBookDetailResponse>(url);
  return response.data;
};

export interface Verse {
  verse_id?: string;
  verse_number: number;
  version: string;
  text: string;
}

export interface ChapterDetailData {
  chapter_overview: {
    book_description: string;
    book: string;
    chapter_number: number;
    total_verses: number;
  };
  verses: Verse[];
  status_configuration: {
    status: string;
    testament: string;
    book_status: string;
  };
  statistics: {
    total_verses: number;
    book_chapters: number;
  };
  quick_actions: {
    edit_chapter: boolean;
    download_chapter: boolean;
    upload_verses: boolean;
    duplicate_chapter: boolean;
  };
  chapter_id: string;
  book_id: string;
  created_at: string;
}

export interface ChapterDetailResponse {
  status: number;
  message: string;
  data: ChapterDetailData;
}

/**
 * Fetch chapter detail with verses
 * @param bookId - Book ID
 * @param chapterId - Chapter ID
 * @param translation - Optional translation code (KJV or SV) to filter verses
 */
export const fetchChapterDetail = async (
  bookId: string,
  chapterId: string,
  translation?: string
): Promise<ChapterDetailData | null> => {
  try {
    const queryParams = new URLSearchParams();
    if (translation) {
      queryParams.append('translation', translation);
    }

    const url = translation
      ? `${API_URL}/admin/bible/books/${bookId}/chapters/${chapterId}?${queryParams.toString()}`
      : `${API_URL}/admin/bible/books/${bookId}/chapters/${chapterId}`;

    const response = await axios.get<ChapterDetailResponse>(url, {
      headers: {
        'Cache-Control': 'no-cache'
      }
    });

    console.log('Chapter detail response:', response);

    if (!response.data) {
      console.error('No response data received');
      throw new Error('No data received from server');
    }

    const responseData = response.data;

    // Check if status is 1 (success) and data exists
    if (responseData.status === 1 && responseData.data) {
      console.log('Found chapter detail:', responseData.data);
      return responseData.data;
    }

    console.error('Unexpected response structure:', JSON.stringify(responseData, null, 2));
    throw new Error('Unexpected response structure from API');
  } catch (error: any) {
    console.error('Error fetching chapter:', error);
    if (error?.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    } else if (error?.request) {
      console.error('Request was made but no response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    throw error;
  }
};
