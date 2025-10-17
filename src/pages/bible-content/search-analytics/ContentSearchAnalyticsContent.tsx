import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  TrendingUp, 
  Eye, 
  MessageSquare,
  FileText,
  BookOpen,
  Calendar
} from 'lucide-react';

interface SearchResult {
  id: string;
  type: 'verse' | 'explanation' | 'reflection';
  title: string;
  content: string;
  book: string;
  chapter: number;
  verse: number;
  translation: string;
  relevance: number;
  views: number;
  lastAccessed: string;
}

interface AnalyticsData {
  totalSearches: number;
  popularSearches: Array<{
    term: string;
    count: number;
  }>;
  contentEngagement: Array<{
    type: string;
    views: number;
    interactions: number;
  }>;
  userActivity: Array<{
    date: string;
    searches: number;
    views: number;
  }>;
  topContent: Array<{
    id: string;
    title: string;
    type: string;
    views: number;
  }>;
}

const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    type: 'verse',
    title: 'John 3:16',
    content: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
    book: 'John',
    chapter: 3,
    verse: 16,
    translation: 'KJV',
    relevance: 95,
    views: 1250,
    lastAccessed: '2024-01-20'
  },
  {
    id: '2',
    type: 'explanation',
    title: 'John 3:16 - AI Explanation',
    content: 'This verse encapsulates the gospel message: God\'s love motivated the gift of His Son for the salvation of humanity. The term "only begotten" emphasizes Christ\'s unique relationship with the Father.',
    book: 'John',
    chapter: 3,
    verse: 16,
    translation: 'KJV',
    relevance: 88,
    views: 890,
    lastAccessed: '2024-01-19'
  }
];

const mockAnalyticsData: AnalyticsData = {
  totalSearches: 15420,
  popularSearches: [
    { term: 'John 3:16', count: 1250 },
    { term: 'love', count: 890 },
    { term: 'grace', count: 750 },
    { term: 'faith', count: 680 },
    { term: 'salvation', count: 520 }
  ],
  contentEngagement: [
    { type: 'Verses', views: 12500, interactions: 8900 },
    { type: 'Explanations', views: 8900, interactions: 6700 },
    { type: 'Reflections', views: 6500, interactions: 4200 }
  ],
  userActivity: [
    { date: '2024-01-15', searches: 450, views: 1200 },
    { date: '2024-01-16', searches: 520, views: 1350 },
    { date: '2024-01-17', searches: 480, views: 1280 },
    { date: '2024-01-18', searches: 610, views: 1450 },
    { date: '2024-01-19', searches: 580, views: 1380 },
    { date: '2024-01-20', searches: 650, views: 1520 },
    { date: '2024-01-21', searches: 720, views: 1680 }
  ],
  topContent: [
    { id: '1', title: 'John 3:16', type: 'verse', views: 1250 },
    { id: '2', title: 'Psalm 23', type: 'verse', views: 980 },
    { id: '3', title: 'Romans 8:28', type: 'verse', views: 890 },
    { id: '4', title: 'The Power of Prayer', type: 'reflection', views: 750 },
    { id: '5', title: 'God\'s Grace Explained', type: 'explanation', views: 680 }
  ]
};

const ContentSearchAnalyticsContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [contentTypeFilter, setContentTypeFilter] = useState<string>('all');
  const [translationFilter, setTranslationFilter] = useState<string>('all');
  const [analyticsData] = useState<AnalyticsData>(mockAnalyticsData);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    // Simulate search delay
    setTimeout(() => {
      const filtered = mockSearchResults.filter(result => {
        const matchesContent = result.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              result.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = contentTypeFilter === 'all' || result.type === contentTypeFilter;
        const matchesTranslation = translationFilter === 'all' || result.translation === translationFilter;
        return matchesContent && matchesType && matchesTranslation;
      });
      setSearchResults(filtered);
      setIsSearching(false);
    }, 500);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'verse':
        return 'bg-amber-100 text-amber-800';
      case 'explanation':
        return 'bg-purple-100 text-purple-800';
      case 'reflection':
        return 'bg-green-100 text-green-800';
      case 'translation':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'verse':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'explanation':
        return <MessageSquare className="w-4 h-4 text-purple-600" />;
      case 'reflection':
        return <BookOpen className="w-4 h-4 text-green-600" />;
      case 'translation':
        return <FileText className="w-4 h-4 text-orange-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="w-5 h-5 mr-2" />
            Search Bible Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search for verses, explanations, reflections..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch} disabled={isSearching} className="bg-primary hover:bg-primary-dark">
                {isSearching ? 'Searching...' : 'Search'}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Type
                </label>
                <Select value={contentTypeFilter} onValueChange={setContentTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All content types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="verse">Verses</SelectItem>
                    <SelectItem value="explanation">Explanations</SelectItem>
                    <SelectItem value="reflection">Reflections</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Translation
                </label>
                <Select value={translationFilter} onValueChange={setTranslationFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All translations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Translations</SelectItem>
                    <SelectItem value="KJV">King James Version</SelectItem>
                    <SelectItem value="ESV">English Standard Version</SelectItem>
                    <SelectItem value="NIV">New International Version</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Search Results ({searchResults.length})</h3>
                {searchResults.map((result) => (
                  <div key={result.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {getTypeIcon(result.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{result.title}</h3>
                          <p className="text-sm text-gray-600">
                            {result.book} {result.chapter}:{result.verse} • {result.translation}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getTypeColor(result.type)}>
                          {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                        </Badge>
                        <Badge className="bg-green-100 text-green-800">
                          {result.relevance}% relevant
                        </Badge>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm text-gray-700 line-clamp-3">
                        {result.content}
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{result.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{result.lastAccessed}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Searches */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Popular Searches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.popularSearches.map((search, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-amber-100 rounded-full">
                      <span className="text-sm font-bold text-amber-600">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{search.term}</h3>
                      <p className="text-sm text-gray-600">{search.count} searches</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Search className="w-4 h-4 mr-1" />
                    Search
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content Engagement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Content Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.contentEngagement.map((content, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{content.type}</h3>
                    <span className="text-sm text-gray-600">{content.views.toLocaleString()} views</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Views</span>
                      <span className="font-medium">{content.views.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Interactions</span>
                      <span className="font-medium">{content.interactions.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-amber-600 h-2 rounded-full" 
                        style={{ width: `${(content.interactions / content.views) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            User Activity (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analyticsData.userActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">{activity.date}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-900">{activity.searches} searches</span>
                  <span className="text-sm text-gray-600">{activity.views.toLocaleString()} views</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Top Performing Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Content</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">Type</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">Views</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.topContent.map((content) => (
                  <tr key={content.id} className="border-b">
                    <td className="py-3 px-4 font-medium text-gray-900">{content.title}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge className={getTypeColor(content.type)}>
                        {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center text-gray-600">{content.views.toLocaleString()}</td>
                    <td className="py-3 px-4 text-center">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { ContentSearchAnalyticsContent }; 