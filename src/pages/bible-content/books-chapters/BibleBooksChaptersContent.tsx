import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
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

const BibleBooksChaptersContent = () => {
  const [books, setBooks] = useState<BibleBook[]>(mockBooks);
  const [chapters, setChapters] = useState<Chapter[]>(mockChapters);
  const [expandedBooks, setExpandedBooks] = useState<string[]>([]);
  const [isCreatingBook, setIsCreatingBook] = useState(false);
  const [isCreatingChapter, setIsCreatingChapter] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [testamentFilter, setTestamentFilter] = useState<string>('all');
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

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTestament = testamentFilter === 'all' || book.testament === testamentFilter;
    return matchesSearch && matchesTestament;
  });

  const toggleBookExpansion = (bookId: string) => {
    setExpandedBooks(prev => 
      prev.includes(bookId) 
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    );
  };

  const handleCreateBook = () => {
    setIsCreatingBook(true);
    setBookFormData({
      name: '',
      testament: 'old',
      chapters: 0,
      verses: 0,
      description: '',
      status: 'draft'
    });
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
    setIsCreatingChapter(true);
    setChapterFormData({
      bookId,
      number: 1,
      verses: 0,
      status: 'draft'
    });
  };

  const handleSaveChapter = () => {
    const newChapter: Chapter = {
      ...chapterFormData,
      id: Date.now().toString()
    } as Chapter;
    setChapters([...chapters, newChapter]);
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
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'draft':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTestamentColor = (testament: string) => {
    return testament === 'old' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800';
  };

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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Book Name
                  </label>
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
                      onValueChange={(value) => setBookFormData({ ...bookFormData, testament: value as any })}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <Select
                      value={bookFormData.status}
                      onValueChange={(value) => setBookFormData({ ...bookFormData, status: value as any })}
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
                    onChange={(e) => setBookFormData({ ...bookFormData, description: e.target.value })}
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
                      onChange={(e) => setBookFormData({ ...bookFormData, chapters: parseInt(e.target.value) })}
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
                      onChange={(e) => setBookFormData({ ...bookFormData, verses: parseInt(e.target.value) })}
                      min="0"
                    />
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Quick Actions</h4>
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
                className="pl-10"
              />
            </div>
            <div>
              <Select value={testamentFilter} onValueChange={setTestamentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by testament" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Testaments</SelectItem>
                  <SelectItem value="old">Old Testament</SelectItem>
                  <SelectItem value="new">New Testament</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {filteredBooks.length} books
              </span>
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
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleBookExpansion(book.id)}
                >
                  <div className="flex items-center space-x-3">
                    {expandedBooks.includes(book.id) ? (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    )}
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{book.name}</h3>
                      <p className="text-sm text-gray-600">{book.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getTestamentColor(book.testament)}>
                      {book.testament === 'old' ? 'OT' : 'NT'}
                    </Badge>
                    <Badge className={getStatusColor(book.status)}>
                      {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {book.chapters} chapters, {book.verses.toLocaleString()} verses
                    </span>
                  </div>
                </div>

                {expandedBooks.includes(book.id) && (
                  <div className="border-t bg-gray-50 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Chapters</h4>
                      <Button 
                        size="sm" 
                        onClick={() => handleCreateChapter(book.id)}
                        className="bg-primary hover:bg-primary-dark"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Chapter
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {chapters
                        .filter(chapter => chapter.bookId === book.id)
                        .map((chapter) => (
                          <div key={chapter.id} className="border rounded-lg p-3 bg-white">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium text-gray-900">Chapter {chapter.number}</h5>
                              <Badge className={getStatusColor(chapter.status)}>
                                {chapter.status.charAt(0).toUpperCase() + chapter.status.slice(1)}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{chapter.verses} verses</p>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
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
                    onChange={(e) => setChapterFormData({ ...chapterFormData, number: parseInt(e.target.value) })}
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
                    onChange={(e) => setChapterFormData({ ...chapterFormData, verses: parseInt(e.target.value) })}
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <Select
                    value={chapterFormData.status}
                    onValueChange={(value) => setChapterFormData({ ...chapterFormData, status: value as any })}
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
                  <h4 className="font-medium text-gray-900 mb-2">Quick Actions</h4>
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
    </div>
  );
};

export { BibleBooksChaptersContent }; 