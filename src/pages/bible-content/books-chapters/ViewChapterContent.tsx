import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VerseDetailModal } from '@/components/verse-detail-modal/VerseDetailModal';
import { 
  ArrowLeft, 
  BookOpen,
  FileText,
  CheckCircle,
  Clock,
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
  chapterId: string;
  number: number;
  text: string;
  translation: string;
}

const mockBooks: BibleBook[] = [
  {
    id: '1',
    name: 'Genesis',
    testament: 'old',
    chapters: 50,
    verses: 1533,
    description: 'The first book of the Bible, containing the creation story and early history.',
    status: 'active'
  },
  {
    id: '2',
    name: 'Exodus',
    testament: 'old',
    chapters: 40,
    verses: 1213,
    description: 'The second book of the Bible, containing the story of the Israelites\' exodus from Egypt.',
    status: 'active'
  },
  {
    id: '3',
    name: 'Matthew',
    testament: 'new',
    chapters: 28,
    verses: 1071,
    description: 'The first book of the New Testament, containing the Gospel of Matthew.',
    status: 'active'
  },
  {
    id: '4',
    name: 'Mark',
    testament: 'new',
    chapters: 16,
    verses: 678,
    description: 'The second book of the New Testament, containing the Gospel of Mark.',
    status: 'active'
  }
];

const mockChapters: Chapter[] = [
  { id: '1', bookId: '1', number: 1, verses: 31, status: 'active' },
  { id: '2', bookId: '1', number: 2, verses: 25, status: 'active' },
  { id: '3', bookId: '1', number: 3, verses: 24, status: 'active' },
  { id: '4', bookId: '3', number: 1, verses: 25, status: 'active' },
  { id: '5', bookId: '3', number: 2, verses: 23, status: 'active' }
];

const mockVerses: Verse[] = [
  { id: '1', chapterId: '1', number: 1, text: 'In the beginning God created the heaven and the earth.', translation: 'KJV' },
  { id: '2', chapterId: '1', number: 2, text: 'And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.', translation: 'KJV' },
  { id: '3', chapterId: '1', number: 3, text: 'And God said, Let there be light: and there was light.', translation: 'KJV' },
  { id: '4', chapterId: '1', number: 4, text: 'And God saw the light, that it was good: and God divided the light from the darkness.', translation: 'KJV' },
  { id: '5', chapterId: '1', number: 5, text: 'And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.', translation: 'KJV' }
];

const ViewChapterContent: React.FC = () => {
  const { bookId, chapterId } = useParams<{ bookId: string; chapterId: string }>();
  const navigate = useNavigate();
  const [selectedVerse, setSelectedVerse] = useState<any>(null);
  const [isVerseModalOpen, setIsVerseModalOpen] = useState(false);
  
  // Find the book and chapter
  const book = mockBooks.find(b => b.id === bookId);
  const chapter = mockChapters.find(c => c.id === chapterId && c.bookId === bookId);
  const chapterVerses = mockVerses.filter(v => v.chapterId === chapterId);

  const handleVerseClick = (verse: Verse) => {
    if (!book || !chapter) return;
    
    const verseData = {
      id: verse.id,
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

  if (!book || !chapter) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Chapter Not Found</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">The chapter you're looking for doesn't exist.</p>
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
          <Button variant="outline">
            <Copy className="w-4 h-4 mr-2" />
            Duplicate
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" disabled title="Content editing not available in Phase 1">
            <Edit className="w-4 h-4 mr-2" />
            Edit Chapter (Phase 2)
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
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Book Description</h4>
                <p className="text-gray-900 dark:text-white">{book.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Book</h4>
                  <p className="text-gray-900 dark:text-white">{book.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Chapter Number</h4>
                  <p className="text-gray-900 dark:text-white">{chapter.number}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Total Verses</h4>
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
                            <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                              Verse {verse.number}
                            </Badge>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{verse.translation}</span>
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
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</span>
                {getStatusBadge(chapter.status)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Testament</span>
                {getTestamentBadge(book.testament)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Book Status</span>
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
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Verses</h4>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{chapter.verses}</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800/30">
                <div className="flex items-center space-x-2 mb-2">
                  <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Book Chapters</h4>
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
              <Button variant="outline" className="w-full justify-start" disabled title="Content editing not available in Phase 1">
                <Edit className="w-4 h-4 mr-2" />
                Edit Chapter (Phase 2)
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="w-4 h-4 mr-2" />
                Download Chapter
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Upload className="w-4 h-4 mr-2" />
                Upload Verses
              </Button>
              <Button variant="outline" className="w-full justify-start">
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

