import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { fetchChapterDetail, type ChapterDetailData } from '@/services/bibleBooksApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { VerseDetailModal } from '@/components/verse-detail-modal/VerseDetailModal';
import { ChapterDetailModal } from '@/components/chapter-detail-modal/ChapterDetailModal';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
// Only 4 experience levels matching user side (no Advanced Student or Scholar)
const CHAPTER_EXPERIENCE_LEVELS = [
  'NEW_TO_BIBLE',
  'SOME_KNOWLEDGE',
  'REGULAR_READER',
  'THEOLOGICAL_TRAINING'
] as const;
import { fetchChapterAIExplanationHistory, type ChapterAIExplanationHistoryResponse } from '@/services/aiExplanationsApi';
import {
  ArrowLeft,
  BookOpen,
  FileText,
  AlertCircle,
  Eye,
  Edit,
  Copy,
  Download,
  Upload,
  ChevronLeft,
  ChevronRight,
  Loader2
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
    status: (apiData.status_configuration.book_status?.toLowerCase() || 'active') as
      | 'active'
      | 'inactive'
      | 'draft'
  };

  const chapter: Chapter = {
    id: apiData.chapter_id,
    bookId: apiData.book_id,
    number: apiData.chapter_overview.chapter_number,
    verses: apiData.statistics.total_verses,
    status: (apiData.status_configuration.status?.toLowerCase() || 'active') as
      | 'active'
      | 'inactive'
      | 'draft'
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
  const [searchParams] = useSearchParams();
  
  // Get translation from URL query parameter, default to 'KJV' if not provided
  const getTranslationFromUrl = () => {
    const translation = searchParams.get('translation');
    return (translation === 'KJV' || translation === 'SV') ? translation : 'KJV';
  };
  
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
  const [translationFilter, setTranslationFilter] = useState<string>(() => getTranslationFromUrl());
  const [currentPage, setCurrentPage] = useState(1);
  const [isChapterDeepStudy, setIsChapterDeepStudy] = useState(false);
  const [selectedChapterTab, setSelectedChapterTab] = useState<{
    chapterId: string;
    book: string;
    chapter: number;
    tabName: string;
    experienceLevel?: string;
  } | null>(null);
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
  const [selectedExperienceLevel, setSelectedExperienceLevel] = useState<string>('NEW_TO_BIBLE');
  const [chapterExplanations, setChapterExplanations] = useState<ChapterAIExplanationHistoryResponse['data'] | null>(null);
  const [loadingExplanations, setLoadingExplanations] = useState(false);

  // Sync translationFilter with URL parameter when it changes
  useEffect(() => {
    const urlTranslation = getTranslationFromUrl();
    // Update if different to ensure it's always in sync with URL
    setTranslationFilter((prev) => {
      if (urlTranslation !== prev) {
        return urlTranslation;
      }
      return prev;
    });
  }, [searchParams]);

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
    setCurrentPage(1); // Reset to first page when chapter changes
  }, [bookId, chapterId, translationFilter]);

  // Load chapter explanations when chapter is loaded and deep study is enabled
  const loadChapterExplanations = async () => {
    if (!chapter?.id || !isChapterDeepStudy) {
      setChapterExplanations(null);
      return;
    }

    try {
      setLoadingExplanations(true);
      const response = await fetchChapterAIExplanationHistory(chapter.id);
      if (response.status === 1 && response.data) {
        setChapterExplanations(response.data);
      } else {
        setChapterExplanations(null);
      }
    } catch (error: any) {
      console.error('Error loading chapter explanations:', error);
      setChapterExplanations(null);
    } finally {
      setLoadingExplanations(false);
    }
  };

  useEffect(() => {
    loadChapterExplanations();
  }, [chapter?.id, isChapterDeepStudy]);

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

  const handleChapterTabClick = (tabName: string) => {
    if (!book || !chapter) return;

    const chapterTabData = {
      chapterId: chapter.id, // Pass chapter_id UUID for API calls
      book: book.name,
      chapter: chapter.number,
      tabName: tabName,
      experienceLevel: selectedExperienceLevel
    };
    setSelectedChapterTab(chapterTabData);
    setIsChapterModalOpen(true);
  };

  // Map experience_level to UI labels (only 4 levels matching user side)
  const mapExperienceLevel = (level: string): string => {
    const levelMap: Record<string, string> = {
      'NEW_TO_BIBLE': 'First Time',
      'SOME_KNOWLEDGE': 'Occasional',
      'REGULAR_READER': 'Regular Reader',
      'THEOLOGICAL_TRAINING': 'Theological Training'
    };
    return levelMap[level.toUpperCase()] || level;
  };

  // Convert markdown to plain text for preview (strip formatting but keep structure)
  const getPreviewText = (content: string | null | undefined, maxLength: number = 150): string => {
    if (!content) return '';
    
    let text = content;
    
    // Remove HTML tags
    text = text.replace(/<[^>]*>/g, '');
    
    // Decode HTML entities
    text = text.replace(/&nbsp;/g, ' ');
    text = text.replace(/&amp;/g, '&');
    text = text.replace(/&lt;/g, '<');
    text = text.replace(/&gt;/g, '>');
    text = text.replace(/&quot;/g, '"');
    text = text.replace(/&#39;/g, "'");
    
    // Remove markdown formatting but keep text
    text = text.replace(/\*\*(.*?)\*\*/g, '$1');
    text = text.replace(/__(.*?)__/g, '$1');
    text = text.replace(/\*([^*\n]+?)\*/g, '$1');
    text = text.replace(/_([^_\n]+?)_/g, '$1');
    text = text.replace(/^#{1,6}\s+(.*)$/gm, '$1');
    text = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
    text = text.replace(/```[\s\S]*?```/g, '');
    text = text.replace(/`([^`\n]+)`/g, '$1');
    
    // Clean up whitespace
    text = text.replace(/\n{3,}/g, '\n\n');
    text = text.replace(/[ \t]{2,}/g, ' ');
    text = text.trim();
    
    // Truncate if needed
    if (text.length > maxLength) {
      text = text.substring(0, maxLength).trim() + '...';
    }
    
    return text;
  };

  // Get all available explanation types from API response dynamically
  // This matches what's shown on the user side - uses labels directly from API
  // Only shows explanations for the 4 allowed experience levels
  const getAvailableExplanationTabs = () => {
    if (!chapterExplanations?.explanations || chapterExplanations.explanations.length === 0) {
      // If no data, return empty array (will show empty state)
      return [];
    }

    // Get unique labels from API, preserving the order they appear
    // Filter to only include explanations for the 4 allowed experience levels
    // Use a Set to track unique labels, and an array to preserve order
    const seenLabels = new Set<string>();
    const uniqueLabels: string[] = [];
    const allowedLevels = new Set(CHAPTER_EXPERIENCE_LEVELS);
    
    chapterExplanations.explanations.forEach((exp: any) => {
      const label = exp.label;
      const expLevel = exp.experience_level;
      
      // Only include if it's one of the 4 allowed experience levels
      if (label && allowedLevels.has(expLevel) && !seenLabels.has(label)) {
        seenLabels.add(label);
        uniqueLabels.push(label);
      }
    });

    return uniqueLabels;
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
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Chapter Not Found
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {error || "The chapter you're looking for doesn't exist."}
        </p>
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
        return (
          <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
            Active
          </Badge>
        );
      case 'inactive':
        return (
          <Badge className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300">
            Inactive
          </Badge>
        );
      case 'draft':
        return (
          <Badge className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
            Draft
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTestamentBadge = (testament: string) => {
    return testament === 'old' ? (
      <Badge className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300">
        Old Testament
      </Badge>
    ) : (
      <Badge className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
        New Testament
      </Badge>
    );
  };

  // Pagination logic
  const versesPerPage = 10;
  const totalPages = Math.ceil(chapterVerses.length / versesPerPage);
  const startIndex = (currentPage - 1) * versesPerPage;
  const endIndex = startIndex + versesPerPage;
  const paginatedVerses = chapterVerses.slice(startIndex, endIndex);

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
          <Button variant="outline" disabled={true} title="Duplicate not available">
            <Copy className="w-4 h-4 mr-2" />
            Duplicate
          </Button>
          <Button variant="outline" disabled={true} title="Download not available">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" disabled={true} title="Edit not available">
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
                <h4 className="text-sm font-medium text-gray-700 dark:text-white mb-2">
                  Book Description
                </h4>
                <p className="text-gray-900 dark:text-white">{book.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-white mb-2">Book</h4>
                  <p className="text-gray-900 dark:text-white">{book.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-white mb-2">
                    Chapter Number
                  </h4>
                  <p className="text-gray-900 dark:text-white">{chapter.number}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-700 dark:text-white mb-2">
                  Total Verses
                </h4>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{chapter.verses}</p>
              </div>
            </CardContent>
          </Card>

          {/* Verses List / Chapter Deep Study */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Verses ({chapterVerses.length})
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Label htmlFor="deep-study-toggle" className="text-sm text-gray-600 dark:text-gray-400">
                    Deep Study
                  </Label>
                  <Switch
                    id="deep-study-toggle"
                    checked={isChapterDeepStudy}
                    onCheckedChange={setIsChapterDeepStudy}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {!isChapterDeepStudy ? (
                <div className="space-y-4">
                  {chapterVerses.length > 0 ? (
                    <>
                      {paginatedVerses.map((verse) => (
                        <div
                          key={verse.id}
                          className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-coal-100 transition-colors border-gray-200 dark:border-gray-700"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <Badge
                                  variant="default"
                                  className="dark:border-gray-600 dark:text-gray-300"
                                >
                                  Verse {verse.number}
                                </Badge>
                                <span className="text-xs text-gray-500 dark:text-white">
                                  {verse.translation}
                                </span>
                              </div>
                              <p className="text-gray-900 dark:text-white leading-relaxed">
                                {verse.text}
                              </p>
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
                      ))}
                      {/* Pagination Controls */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Showing page {currentPage} of {totalPages}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                              disabled={currentPage === 1}
                            >
                              <ChevronLeft className="w-4 h-4" />
                              Previous
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                              disabled={currentPage === totalPages}
                            >
                              Next
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No verses available for this chapter</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Experience Level Selector */}
                  <div className="flex items-center gap-2 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <Label htmlFor="experience-level-select" className="text-sm font-medium text-gray-700 dark:text-white">
                      Experience Level:
                    </Label>
                    <Select value={selectedExperienceLevel} onValueChange={setSelectedExperienceLevel}>
                      <SelectTrigger id="experience-level-select" className="w-[200px]">
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        {CHAPTER_EXPERIENCE_LEVELS.map((level) => (
                          <SelectItem key={level} value={level}>
                            {mapExperienceLevel(level)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {loadingExplanations ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin" />
                      <p>Loading chapter explanations...</p>
                    </div>
                  ) : chapterExplanations && chapterExplanations.explanations && chapterExplanations.explanations.length > 0 ? (
                    getAvailableExplanationTabs().map((tabLabel) => {
                      // Find the explanation for this tab label and experience level
                      // Match by label and experience level directly from API
                      // Only show explanations for the 4 allowed experience levels
                      const explanation = chapterExplanations.explanations.find(
                        (exp: any) => {
                          const expLabel = exp.label;
                          const expLevel = exp.experience_level;
                          const matchesLabel = expLabel === tabLabel;
                          const matchesExperienceLevel = expLevel === selectedExperienceLevel;
                          const isAllowedLevel = CHAPTER_EXPERIENCE_LEVELS.includes(expLevel as any);
                          
                          return matchesLabel && matchesExperienceLevel && isAllowedLevel;
                        }
                      );

                      const hasContent = explanation?.has_content || (explanation?.content && explanation.content.trim().length > 0);

                      // Get preview text (first 150 characters of cleaned content or placeholder)
                      const getPreviewTextForDisplay = () => {
                        if (hasContent && explanation?.content) {
                          return getPreviewText(explanation.content, 150);
                        }
                        // Format: "TabLabel ExperienceLevel Not Created Content for this section is being prepared. Click to view or create."
                        return `${tabLabel} ${mapExperienceLevel(selectedExperienceLevel)} Not Created Content for this section is being prepared. Click to view or create.`;
                      };

                      return (
                        <div
                          key={tabLabel}
                          className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-coal-100 transition-colors border-gray-200 dark:border-gray-700"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  {tabLabel}
                                </h4>
                                <Badge className="bg-blue-100 text-blue-800 dark:bg-sand dark:text-white text-xs">
                                  {mapExperienceLevel(selectedExperienceLevel)}
                                </Badge>
                                {!hasContent && (
                                  <Badge variant="outline" className="text-xs">
                                    Not Created
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                {getPreviewTextForDisplay()}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-4"
                              onClick={() => handleChapterTabClick(tabLabel)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    // Show message when no data exists
                    getAvailableExplanationTabs().length > 0 ? (
                      getAvailableExplanationTabs().map((tabLabel) => {
                      return (
                        <div
                          key={tabLabel}
                          className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-coal-100 transition-colors border-gray-200 dark:border-gray-700"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  {tabLabel}
                                </h4>
                                <Badge className="bg-blue-100 text-blue-800 dark:bg-sand dark:text-white text-xs">
                                  {mapExperienceLevel(selectedExperienceLevel)}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  Not Created
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                {tabLabel} {mapExperienceLevel(selectedExperienceLevel)} Not Created Content for this section is being prepared. Click to view or create.
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-4"
                              onClick={() => handleChapterTabClick(tabLabel)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      );
                      })
                    ) : (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No chapter explanations available. Toggle Deep Study off to view verses.</p>
                      </div>
                    )
                  )}
                </div>
              )}
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
                <span className="text-sm font-medium text-gray-700 dark:text-white">
                  Book Status
                </span>
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
                  <h4 className="text-sm font-medium text-gray-700 dark:text-white">
                    Total Verses
                  </h4>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{chapter.verses}</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800/30">
                <div className="flex items-center space-x-2 mb-2">
                  <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <h4 className="text-sm font-medium text-gray-700 dark:text-white">
                    Book Chapters
                  </h4>
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

      {/* Chapter Detail Modal */}
      <ChapterDetailModal
        isOpen={isChapterModalOpen}
        onClose={() => {
          setIsChapterModalOpen(false);
          setSelectedChapterTab(null);
        }}
        chapter={selectedChapterTab}
        onRefresh={loadChapterExplanations}
      />
    </div>
  );
};

export { ViewChapterContent };
