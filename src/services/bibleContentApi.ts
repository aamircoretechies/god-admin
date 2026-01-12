import axios from 'axios';
import { API_URL } from '@/utils/Api';

export interface BibleDashboardResponse {
  success: boolean;
  data: {
    overview: {
      totalTranslations: number;
      activeTranslations: number;
      totalVerses: number;
      aiExplanations: number;
      flaggedContent: number;
    };
    monthlyStats: {
      translations: {
        thisMonth: number;
        lastMonth: number;
        change: number;
      };
      verses: {
        thisMonth: number;
      };
      aiExplanations: {
        thisMonth: number;
      };
      reports: {
        thisMonth: number;
      };
    };
    translationsByStatus: {
      [key: string]: number;
    };
    translationsByLanguage: {
      [key: string]: number;
    };
    recentActivity: {
      versions: Array<{
        version_id: string;
        full_name: string;
        abbreviation: string;
        language: string;
        created_at: string;
      }>;
      reports: Array<{
        report_id: string;
        book: string;
        chapter: number;
        verse: number;
        version: string;
        status: string;
        created_at: string;
      }>;
      aiExplanations: Array<{
        verse_id: string;
        book: {
          long_name: string;
          short_name: string;
        };
        chapter_number: number;
        verse_number: number;
        created_at: string;
      }>;
    };
    topTranslations: Array<{
      version_id: string;
      name: string;
      abbreviation: string;
      language: string;
      total_verses: number;
      created_at: string;
    }>;
  };
}

/**
 * Fetch Bible Content Dashboard data
 */
export const fetchBibleDashboard = async (): Promise<BibleDashboardResponse> => {
  const response = await axios.get<BibleDashboardResponse>(`${API_URL}/admin/bible/dashboard`);
  return response.data;
};

/**
 * Get language name from code
 */
export const getLanguageName = (code: string): string => {
  const languageMap: { [key: string]: string } = {
    en: 'English',
    nl: 'Dutch',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    it: 'Italian',
    pt: 'Portuguese',
    ru: 'Russian',
    zh: 'Chinese',
    ja: 'Japanese',
    ko: 'Korean',
    ar: 'Arabic',
    hi: 'Hindi'
  };
  return languageMap[code] || code.toUpperCase();
};
