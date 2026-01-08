import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchChapterDetail, type ChapterDetailData } from '@/services/bibleBooksApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VerseDetailModal } from '@/components/verse-detail-modal/VerseDetailModal';
import { 
  ArrowLeft, 
  BookOpen,
  FileText,
  AlertCircle,
  Eye,
  Edit,
  Copy,
  Download,
  Upload
} from 'lucide-react';

interface BibleBook {
  id: string;
  name: string;
  testament: 'old' | 'new';
  chapters: number;
  verses: number;
  description: string;
  status: 'active' | 'inactive' | 'draft';
}

interface Chapter {
  id: string;
  bookId: string;
  number: number;
  verses: number;
  status: 'active' | 'inactive' | 'draft';
}

interface Verse {
  id: string;
  verseId?: string; // UUID verse_id for API calls
  chapterId: string;
  number: number;
  text: string;
  translation: string;
}

// Transform API response to component format
const transformChapterData = (apiData: ChapterDetailData) => {
  const book: BibleBook = {
    id: apiData.book_id,
    name: apiData.chapter_overview.book,
    testament: (apiData.status_configuration.testament === 'OLD' ? 'old' : 'new') as 'old' | 'new',
    chapters: apiData.statistics.book_chapters,
    verses: 0, // Not provided in API
    description: apiData.chapter_overview.book_description,
    status: (apiData.status_configuration.book_status?.toLowerCase() || 'active') as 'active' | 'inactive' | 'draft'
  };

  const chapter: Chapter = {
    id: apiData.chapter_id,
    bookId: apiData.book_id,
    number: apiData.chapter_overview.chapter_number,
    verses: apiData.statistics.total_verses,
    status: (apiData.status_configuration.status?.toLowerCase() || 'active') as 'active' | 'inactive' | 'draft'
  };

  const chapterVerses: Verse[] = apiData.verses.map((verse) => ({
    id: `${apiData.chapter_id}-verse-${verse.verse_number}`,
    verseId: verse.verse_id, // UUID verse_id from API if available
    chapterId: apiData.chapter_id,
    number: verse.verse_number,
    text: verse.text,
    translation: verse.version
  }));

  return { book, chapter, chapterVerses, quickActions: apiData.quick_actions };
};

const ViewChapterContent: React.FC = () => {
  const { bookId, chapterId } = useParams<{ bookId: string; chapterId: string }>();
  const navigate = useNavigate();
  const [selectedVerse, setSelectedVerse] = useState<any>(null);
  const [isVerseModalOpen, setIsVerseModalOpen] = useState(false);
  const [book, setBook] = useState<BibleBook | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [chapterVerses, setChapterVerses] = useState<Verse[]>([]);
  const [quickActions, setQuickActions] = useState<{
    edit_chapter: boolean;
    download_chapter: boolean;
    upload_verses: boolean;
    duplicate_chapter: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [translationFilter, setTranslationFilter] = useState<string>('KJV');

  useEffect(() => {
    const loadChapter = async () => {
      if (!bookId || !chapterId) {
        setError('Book ID or Chapter ID is missing');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const apiData = await fetchChapterDetail(bookId, chapterId, translationFilter);
        
        if (apiData) {
          const transformed = transformChapterData(apiData);
          setBook(transformed.book);
          setChapter(transformed.chapter);
          setChapterVerses(transformed.chapterVerses);
          setQuickActions(transformed.quickActions);
        } else {
          setError('Chapter not found');
        }
      } catch (err: any) {
        console.error('Error loading chapter:', err);
        setError(err?.response?.data?.message || err?.message || 'Failed to load chapter');
      } finally {
        setLoading(false);
      }
    };

    loadChapter();
  }, [bookId, chapterId, translationFilter]);

  const handleVerseClick = (verse: Verse) => {
    if (!book || !chapter) return;
    
    const verseData = {
      id: verse.id,
      verseId: verse.verseId, // Pass verse_id UUID for API calls
      book: book.name,
      chapter: chapter.number,
      verse: verse.number,
      text: verse.text,
      translation: verse.translation,
      language: 'English', // Default language
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    };
    setSelectedVerse(verseData);
    setIsVerseModalOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !book || !chapter) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Chapter Not Found</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error || 'The chapter you\'re looking for doesn\'t exist.'}</p>
        <Button onClick={() => navigate('/bible-content/books-chapters')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Books & Chapters
        </Button>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300">Inactive</Badge>;
      case 'draft':
        return <Badge className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTestamentBadge = (testament: string) => {
    return testament === 'old' ? (
      <Badge className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300">Old Testament</Badge>
    ) : (
      <Badge className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">New Testament</Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/bible-content/books-chapters')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {book.name} - Chapter {chapter.number}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {getTestamentBadge(book.testament)} • {chapter.verses} verses
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={translationFilter} onValueChange={setTranslationFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Translation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="KJV">KJV</SelectItem>
              <SelectItem value="SV">SV</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            disabled={true}
            title="Duplicate not available"
          >
            <Copy className="w-4 h-4 mr-2" />
            Duplicate
          </Button>
          <Button 
            variant="outline" 
            disabled={true}
            title="Download not available"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button 
            variant="outline" 
            disabled={true}
            title="Edit not available"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Chapter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chapter Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Chapter Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-white mb-2">Book Description</h4>
                <p className="text-gray-900 dark:text-white">{book.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-white mb-2">Book</h4>
                  <p className="text-gray-900 dark:text-white">{book.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-white mb-2">Chapter Number</h4>
                  <p className="text-gray-900 dark:text-white">{chapter.number}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-700 dark:text-white mb-2">Total Verses</h4>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{chapter.verses}</p>
              </div>
            </CardContent>
          </Card>

          {/* Verses List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Verses ({chapterVerses.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {chapterVerses.length > 0 ? (
                  chapterVerses.map((verse) => (
                    <div 
                      key={verse.id} 
                      className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-coal-100 transition-colors border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="default" className="dark:border-gray-600 dark:text-gray-300">
                              Verse {verse.number}
                            </Badge>
                            <span className="text-xs text-gray-500 dark:text-white">{verse.translation}</span>
                          </div>
                          <p className="text-gray-900 dark:text-white leading-relaxed">{verse.text}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="ml-4"
                          onClick={() => handleVerseClick(verse)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No verses available for this chapter</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Status & Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-white">Status</span>
                {getStatusBadge(chapter.status)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-white">Testament</span>
                {getTestamentBadge(book.testament)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-white">Book Status</span>
                {getStatusBadge(book.status)}
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h4 className="text-sm font-medium text-gray-700 dark:text-white">Total Verses</h4>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{chapter.verses}</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800/30">
                <div className="flex items-center space-x-2 mb-2">
                  <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <h4 className="text-sm font-medium text-gray-700 dark:text-white">Book Chapters</h4>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{book.chapters}</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                disabled={true}
                title="Edit not available"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Chapter
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                disabled={true}
                title="Download not available"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Chapter
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                disabled={true}
                title="Upload not available"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Verses
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                disabled={true}
                title="Duplicate not available"
              >
                <Copy className="w-4 h-4 mr-2" />
                Duplicate Chapter
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Verse Detail Modal */}
      <VerseDetailModal
        isOpen={isVerseModalOpen}
        onClose={() => {
          setIsVerseModalOpen(false);
          setSelectedVerse(null);
        }}
        verse={selectedVerse}
      />
    </div>
  );
};

export { ViewChapterContent };

