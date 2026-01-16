import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { VerseDetailModal } from '@/components/verse-detail-modal/VerseDetailModal';
import {
  BookOpen,
  Plus,
  Edit,
  Save,
  X,
  ChevronDown,
  ChevronRight,
  FileText,
  Search,
  Filter,
  Eye,
  Copy
} from 'lucide-react';
import { fetchBibleBooks, fetchBibleBookDetail } from '@/services/bibleBooksApi';
import { DummyDataIndicator } from '@/components/dummy-data-indicator';

interface BibleBook {
  id: string;
  name: string;
  shortName: string;
  testament: 'old' | 'new';
  chapters: number;
  verses: number; // Dummy - not in API
  description: string; // Dummy - not in API
  status: 'active' | 'inactive' | 'draft'; // Dummy - not in API
  bookOrder: number;
}

interface Chapter {
  id: string;
  bookId: string;
  number: number;
  verses: number; // Dummy - not in API
  status: 'active' | 'inactive' | 'draft'; // Dummy - not in API
}

const BibleBooksChaptersContent = () => {
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [chapters, setChapters] = useState<{ [bookId: string]: Chapter[] }>({});
  const [expandedBooks, setExpandedBooks] = useState<string[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadingChapters, setLoadingChapters] = useState<{ [bookId: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);
  const [isCreatingBook, setIsCreatingBook] = useState(false);
  const [isCreatingChapter, setIsCreatingChapter] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [testamentFilter, setTestamentFilter] = useState<string>('all');
  const [translationFilter, setTranslationFilter] = useState<string>('KJV');
  const [selectedVerse, setSelectedVerse] = useState<any>(null);
  const [isVerseModalOpen, setIsVerseModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [bookFormData, setBookFormData] = useState<Partial<BibleBook>>({
    name: '',
    testament: 'old',
    chapters: 0,
    verses: 0,
    description: '',
    status: 'draft'
  });
  const [chapterFormData, setChapterFormData] = useState<Partial<Chapter>>({
    bookId: '',
    number: 1,
    verses: 0,
    status: 'draft'
  });

  // Reset page and clear chapters when translation filter changes
  useEffect(() => {
    setCurrentPage(1);
    setChapters({}); // Clear chapters cache when translation changes
    setExpandedBooks([]); // Collapse all books when translation changes
  }, [translationFilter]);

  // Load books on component mount
  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoadingBooks(true);
        setError(null);
        const response = await fetchBibleBooks({
          page: currentPage,
          limit: 20,
          translation: translationFilter
        });
        if (response.status === 1) {
          const transformedBooks: BibleBook[] = response.data.map((book) => ({
            id: book.book_id,
            name: book.long_name,
            shortName: book.short_name,
            testament: (book.testament === 'OLD' ? 'old' : 'new') as 'old' | 'new',
            chapters: book.total_chapters,
            verses: 0, // Dummy - not in API
            description: '', // Dummy - not in API
            status: 'active' as const, // Dummy - not in API
            bookOrder: book.book_order
          }));
          setBooks(transformedBooks);
          
          // Update pagination metadata
          if (response.pagination) {
            setTotalPages(response.pagination.totalPages || 1);
          } else {
            // Fallback: if we got exactly 20 books, assume there might be more pages
            // Otherwise, assume this is the last page
            if (response.data.length === 20) {
              // If we have 20 books, there might be more pages
              // Set to at least currentPage + 1 to show pagination
              setTotalPages(Math.max(currentPage + 1, currentPage));
            } else {
              // Less than 20 books means this is likely the last page
              setTotalPages(currentPage);
            }
          }
        } else {
          setError('Failed to load books');
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to load books');
      } finally {
        setLoadingBooks(false);
      }
    };

    loadBooks();
  }, [currentPage, translationFilter]);

  // Load chapters when a book is expanded
  const loadChaptersForBook = async (bookId: string) => {
    if (chapters[bookId]) {
      // Already loaded (cache is cleared when translation changes)
      return;
    }

    try {
      setLoadingChapters((prev) => ({ ...prev, [bookId]: true }));
      const response = await fetchBibleBookDetail(bookId, translationFilter);
      if (response.status === 1) {
        const transformedChapters: Chapter[] = response.data.chapters.map((chapter) => ({
          id: chapter.chapter_id,
          bookId: bookId,
          number: chapter.chapter_number,
          verses: 0, // Dummy - not in API
          status: 'active' as const // Dummy - not in API
        }));
        setChapters((prev) => ({ ...prev, [bookId]: transformedChapters }));
      }
    } catch (err: any) {
      console.error('Failed to load chapters:', err);
    } finally {
      setLoadingChapters((prev) => ({ ...prev, [bookId]: false }));
    }
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTestament = testamentFilter === 'all' || book.testament === testamentFilter;
    return matchesSearch && matchesTestament;
  });

  const toggleBookExpansion = (bookId: string) => {
    setExpandedBooks((prev) => {
      const isExpanded = prev.includes(bookId);
      if (!isExpanded) {
        // Load chapters when expanding
        loadChaptersForBook(bookId);
      }
      return isExpanded ? prev.filter((id) => id !== bookId) : [...prev, bookId];
    });
  };

  const handleCreateBook = () => {
    // Content creation not available in Phase 1 - read-only mode
    console.log('Content creation disabled in Phase 1');
  };

  const handleSaveBook = () => {
    const newBook: BibleBook = {
      ...bookFormData,
      id: Date.now().toString()
    } as BibleBook;
    setBooks([...books, newBook]);
    setIsCreatingBook(false);
    setBookFormData({
      name: '',
      testament: 'old',
      chapters: 0,
      verses: 0,
      description: '',
      status: 'draft'
    });
  };

  const handleCreateChapter = (bookId: string) => {
    // Content creation not available in Phase 1 - read-only mode
    console.log('Content creation disabled in Phase 1');
  };

  const handleViewVerse = (bookName: string, chapterNumber: number, verseNumber: number) => {
    // Mock verse data for demonstration
    const mockVerse = {
      id: `${bookName}-${chapterNumber}-${verseNumber}`,
      book: bookName,
      chapter: chapterNumber,
      verse: verseNumber,
      text: `This is a sample verse text from ${bookName} ${chapterNumber}:${verseNumber}. In a real implementation, this would be fetched from the database.`,
      translation: 'KJV',
      language: 'English',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    };

    setSelectedVerse(mockVerse);
    setIsVerseModalOpen(true);
  };

  const handleSaveChapter = () => {
    if (!chapterFormData.bookId) return;

    const newChapter: Chapter = {
      ...chapterFormData,
      id: Date.now().toString()
    } as Chapter;
    setChapters({
      ...chapters,
      [chapterFormData.bookId]: [...(chapters[chapterFormData.bookId] || []), newChapter]
    });
    setIsCreatingChapter(false);
    setChapterFormData({
      bookId: '',
      number: 1,
      verses: 0,
      status: 'draft'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'inactive':
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
      case 'draft':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
    }
  };

  const getTestamentColor = (testament: string) => {
    return testament === 'old'
      ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300'
      : 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300';
  };

  if (loadingBooks && books.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="spinner-border spinner-border-sm text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">Loading books...</p>
        </div>
      </div>
    );
  }

  if (error && books.length === 0) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="alert alert-danger">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create Book Form */}
      {isCreatingBook && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Add New Bible Book
              </span>
              <Button variant="outline" size="sm" onClick={() => setIsCreatingBook(false)}>
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Book Name</label>
                  <Input
                    value={bookFormData.name}
                    onChange={(e) => setBookFormData({ ...bookFormData, name: e.target.value })}
                    placeholder="e.g., Genesis"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Testament
                    </label>
                    <Select
                      value={bookFormData.testament}
                      onValueChange={(value) =>
                        setBookFormData({ ...bookFormData, testament: value as any })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="old">Old Testament</SelectItem>
                        <SelectItem value="new">New Testament</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <Select
                      value={bookFormData.status}
                      onValueChange={(value) =>
                        setBookFormData({ ...bookFormData, status: value as any })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <Textarea
                    value={bookFormData.description}
                    onChange={(e) =>
                      setBookFormData({ ...bookFormData, description: e.target.value })
                    }
                    placeholder="Brief description of the book..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Chapters
                    </label>
                    <Input
                      type="number"
                      value={bookFormData.chapters}
                      onChange={(e) =>
                        setBookFormData({ ...bookFormData, chapters: parseInt(e.target.value) })
                      }
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Verses
                    </label>
                    <Input
                      type="number"
                      value={bookFormData.verses}
                      onChange={(e) =>
                        setBookFormData({ ...bookFormData, verses: parseInt(e.target.value) })
                      }
                      min="0"
                    />
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Copy className="w-4 h-4 mr-2" />
                      Import from Another Translation
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Chapter Structure
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
              <Button variant="outline" onClick={() => setIsCreatingBook(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveBook} className="bg-primary hover:bg-primary-dark">
                <Save className="w-4 h-4 mr-2" />
                Create Book
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <div>
              <Select value={translationFilter} onValueChange={setTranslationFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select translation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KJV">KJV</SelectItem>
                  <SelectItem value="SV">SV</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={testamentFilter} onValueChange={setTestamentFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by testament" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Testaments</SelectItem>
                  <SelectItem value="old">Old Testament</SelectItem>
                  <SelectItem value="new">New Testament</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-wrap items-center gap-4 md:col-span-3">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                  {filteredBooks.length} books
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bible Books Tree */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            Bible Books Structure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredBooks.map((book) => (
              <div key={book.id} className="border rounded-lg">
                {/* <div className="flex items-center justify-between p-4 cursor-pointer" */}
                <div
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 cursor-pointer gap-4"
                  onClick={() => toggleBookExpansion(book.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="mt-1 sm:mt-0">
                      {expandedBooks.includes(book.id) ? (
                        <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      )}
                    </div>
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg shrink-0">
                      <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{book.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-1">{book.description}</p>
                    </div>
                  </div>
                  {/* <div className="flex items-center space-x-2"> */}
                  <div className="flex items-center justify-between sm:justify-end space-x-2 pl-7 sm:pl-0">
                    <Badge className={getTestamentColor(book.testament)}>
                      {book.testament === 'old' ? 'OT' : 'NT'}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(book.status)}>
                        {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
                      </Badge>
                      <span className="text-sm text-gray-500 whitespace-nowrap">
                        {book.chapters} chapters
                      </span>
                    </div>
                  </div>
                </div>

                {expandedBooks.includes(book.id) && (
                  <div className="border-t bg-gray-50 dark:bg-coal-100 p-4">
                    {/* <div className="flex items-center justify-between mb-3"> */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                      <h4 className="font-medium text-gray-900 dark:text-white">Chapters</h4>
                      <Button
                        size="sm"
                        onClick={() => handleCreateChapter(book.id)}
                        // className="bg-gray-300 text-gray-900 hover:bg-gray-300 dark:bg-coal-100 dark:hover:bg-coal-100 cursor-not-allowed"
                        className="bg-gray-300 text-gray-900 hover:bg-gray-300 dark:bg-coal-100 dark:hover:bg-coal-100 cursor-not-allowed w-full sm:w-auto"
                        disabled
                        title="Content creation not available in Phase 1"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Chapter (Phase 2)
                      </Button>
                    </div>

                    {loadingChapters[book.id] ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="text-center">
                          <div
                            className="spinner-border spinner-border-sm text-primary"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">Loading chapters...</p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {(chapters[book.id] || []).map((chapter) => (
                          <div key={chapter.id} className="border rounded-lg p-3 bg-card">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium text-gray-900 dark:text-white">
                                Chapter {chapter.number}
                              </h5>
                              <Badge className={getStatusColor(chapter.status)}>
                                {chapter.status.charAt(0).toUpperCase() + chapter.status.slice(1)}
                              </Badge>
                              <DummyDataIndicator text="Status" />
                            </div>
                            {/* Verse count removed - not available from API */}
                            <div className="flex space-x-2">
                              <Link
                                to={`/bible-content/books-chapters/view/${book.id}/${chapter.id}?translation=${translationFilter}`}
                              >
                                <Button variant="outline" size="sm">
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                              </Link>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled
                                title="Content editing not available in Phase 1"
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Edit (Phase 2)
                              </Button>
                            </div>
                          </div>
                        ))}
                        {(!chapters[book.id] || chapters[book.id].length === 0) &&
                          !loadingChapters[book.id] && (
                            <p className="text-sm text-gray-500 col-span-full text-center py-4">
                              No chapters found
                            </p>
                          )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create Chapter Form */}
      {isCreatingChapter && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Add New Chapter
              </span>
              <Button variant="outline" size="sm" onClick={() => setIsCreatingChapter(false)}>
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chapter Number
                  </label>
                  <Input
                    type="number"
                    value={chapterFormData.number}
                    onChange={(e) =>
                      setChapterFormData({ ...chapterFormData, number: parseInt(e.target.value) })
                    }
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Verses
                  </label>
                  <Input
                    type="number"
                    value={chapterFormData.verses}
                    onChange={(e) =>
                      setChapterFormData({ ...chapterFormData, verses: parseInt(e.target.value) })
                    }
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <Select
                    value={chapterFormData.status}
                    onValueChange={(value) =>
                      setChapterFormData({ ...chapterFormData, status: value as any })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy from Another Translation
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Verse Structure
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
              <Button variant="outline" onClick={() => setIsCreatingChapter(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveChapter} className="bg-primary hover:bg-primary-dark">
                <Save className="w-4 h-4 mr-2" />
                Create Chapter
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {(totalPages > 1 || books.length === 20) && (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1 || loadingBooks}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600 whitespace-nowrap">
            Page {currentPage} of {totalPages > 1 ? totalPages : '...'}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (totalPages > 1) {
                setCurrentPage((prev) => Math.min(totalPages, prev + 1));
              } else {
                // If totalPages is unknown but we have 20 books, try next page
                setCurrentPage((prev) => prev + 1);
              }
            }}
            disabled={(totalPages > 1 && currentPage === totalPages) || loadingBooks}
          >
            Next
          </Button>
        </div>
      )}

      {/* Verse Detail Modal */}
      <VerseDetailModal
        isOpen={isVerseModalOpen}
        onClose={() => setIsVerseModalOpen(false)}
        verse={selectedVerse}
      />
    </div>
  );
};

export { BibleBooksChaptersContent };
