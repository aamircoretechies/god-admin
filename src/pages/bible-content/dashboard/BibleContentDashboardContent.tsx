import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Languages, 
  FileText, 
  Brain,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Eye,
  Edit,
  Upload,
  Download
} from 'lucide-react';
import { fetchBibleDashboard, getLanguageName, type BibleDashboardResponse } from '@/services/bibleContentApi';
import { DummyDataIndicator } from '@/components/dummy-data-indicator';
import { toast } from 'sonner';

interface Translation {
  id: string;
  name: string;
  version: string;
  language: string;
  status: 'active' | 'inactive' | 'pending';
  verseCount: number;
  lastUpdated: string;
  fileSize: string;
}

interface ContentStats {
  totalTranslations: number;
  totalVerses: number;
  activeTranslations: number;
  pendingUpdates: number;
  aiExplanations: number;
  flaggedContent: number;
}


const BibleContentDashboardContent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<BibleDashboardResponse['data'] | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchBibleDashboard();
        if (response.success) {
          setDashboardData(response.data);
        } else {
          setError('Failed to load dashboard data');
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="spinner-border spinner-border-sm text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="alert alert-danger">{error || 'Failed to load dashboard data'}</div>
        </div>
      </div>
    );
  }

  // Transform API data to component format
  const contentStats: ContentStats = {
    totalTranslations: dashboardData.overview.totalTranslations,
    totalVerses: dashboardData.overview.totalVerses,
    activeTranslations: dashboardData.overview.activeTranslations,
    pendingUpdates: dashboardData.translationsByStatus.Pending || 0,
    aiExplanations: dashboardData.overview.aiExplanations,
    flaggedContent: dashboardData.overview.flaggedContent
  };

  // Transform topTranslations to component format
  // Top translations are likely active since they're the most used
  const translations: Translation[] = dashboardData.topTranslations.map((translation) => {
    // For now, assume top translations are active
    // If needed, we can enhance this by matching with recentActivity.versions
    const status: 'active' | 'inactive' | 'pending' = 'active';
    
    return {
      id: translation.version_id,
      name: translation.name,
      version: translation.abbreviation,
      language: getLanguageName(translation.language),
      status,
      verseCount: translation.total_verses,
      lastUpdated: new Date(translation.created_at).toLocaleDateString(),
      fileSize: 'N/A' // Not in API response - dummy data
    };
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'inactive':
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'inactive':
        return <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/bible-content/translations')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Translations</p>
                <p className="text-2xl font-bold text-gray-900">{contentStats.totalTranslations}</p>
                <p className={`text-sm ${
                  dashboardData.monthlyStats.translations.change >= 0 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {dashboardData.monthlyStats.translations.change >= 0 ? '+' : ''}
                  {dashboardData.monthlyStats.translations.change} this month
                </p>
              </div>
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                <Languages className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/bible-content/books-chapters')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Verses</p>
                <p className="text-2xl font-bold text-gray-900">{contentStats.totalVerses.toLocaleString()}</p>
                <p className="text-sm text-green-600">
                  {dashboardData.monthlyStats.verses.thisMonth > 0 
                    ? `+${dashboardData.monthlyStats.verses.thisMonth.toLocaleString()} this month`
                    : 'Across all translations'}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/bible-content/ai-explanations')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AI Explanations</p>
                <p className="text-2xl font-bold text-gray-900">{contentStats.aiExplanations.toLocaleString()}</p>
                <p className={`text-sm ${
                  dashboardData.monthlyStats.aiExplanations.thisMonth > 0 
                    ? 'text-green-600' 
                    : 'text-gray-600'
                }`}>
                  {dashboardData.monthlyStats.aiExplanations.thisMonth > 0 
                    ? `+${dashboardData.monthlyStats.aiExplanations.thisMonth.toLocaleString()} this month`
                    : 'No new this month'}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/bible-content/moderation')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Flagged Content</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{contentStats.flaggedContent}</p>
                <p className="text-sm text-red-600 dark:text-red-400">Needs review</p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Translation Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
              Active Translations ({contentStats.activeTranslations})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {translations.filter(t => t.status === 'active').length > 0 ? (
                translations.filter(t => t.status === 'active').map((translation) => (
                  <div key={translation.id} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800/30">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{translation.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{translation.language} • {translation.verseCount.toLocaleString()} verses</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">Active</Badge>
                      <Link to={`/bible-content/translations/view/${translation.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-yellow-600 dark:text-yellow-400" />
              Pending Updates {contentStats.pendingUpdates > 0 && `(${contentStats.pendingUpdates})`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {translations.filter(t => t.status === 'pending').length > 0 ? (
                translations.filter(t => t.status === 'pending').map((translation) => (
                  <div key={translation.id} className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-800/30">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{translation.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{translation.language} • {translation.verseCount.toLocaleString()} verses</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">Pending</Badge>
                      <Link to={`/bible-content/translations?edit=${translation.id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" />
              Inactive Translations ({translations.filter(t => t.status === 'inactive').length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {translations.filter(t => t.status === 'inactive').length > 0 ? (
                translations.filter(t => t.status === 'inactive').map((translation) => (
                  <div key={translation.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-coal-100 rounded-lg ">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{translation.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{translation.language} • {translation.verseCount.toLocaleString()} verses</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">Inactive</Badge>
                      <Link to={`/bible-content/translations?edit=${translation.id}`}>
                        <Button variant="outline" size="sm" className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Translations Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            All Bible Translations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Language</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">File Size</th>
                </tr>
              </thead>
              <tbody>
                {translations.length > 0 ? (
                  translations.map((translation) => (
                    <tr 
                      key={translation.id} 
                      className="cursor-pointer border-b border-gray-200 dark:border-gray-200 hover:bg-gray-200 dark:hover:bg-coal-100 transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        if (translation.id) {
                          navigate(`/bible-content/translations/view/${translation.id}`);
                        } else {
                          toast.error('Translation ID is missing');
                        }
                      }}
                    >
                    <td className="py-3 px-4">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{translation.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{translation.version}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">{translation.language}</span>
                        {translation.verseCount > 0 && (
                          <span className="text-xs text-gray-500">
                            ({translation.verseCount.toLocaleString()} verses)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {/* File size not available - hidden instead of showing N/A */}
                        <DummyDataIndicator text="File size" />
                      </div>
                    </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center">
                        <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No data available</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
              Recent Reports ({dashboardData.recentActivity.reports.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData.recentActivity.reports.length > 0 ? (
                dashboardData.recentActivity.reports.slice(0, 5).map((report) => (
                  <div key={report.report_id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-black">
                        {report.book} {report.chapter}:{report.verse}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {report.version} • {new Date(report.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={`${
                      report.status === 'PENDING' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {report.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="w-5 h-5 mr-2 text-purple-600" />
              Recent AI Explanations ({dashboardData.recentActivity.aiExplanations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData.recentActivity.aiExplanations.length > 0 ? (
                dashboardData.recentActivity.aiExplanations.slice(0, 5).map((explanation) => (
                  <div key={explanation.verse_id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-black">
                        {explanation.book.long_name} {explanation.chapter_number}:{explanation.verse_number}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(explanation.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        // Note: book_id and chapter_id are not available in the API response
                        // Only verse_id, book (with long_name/short_name), chapter_number, and verse_number are available
                        toast.info('Verse navigation not available - book and chapter IDs are not provided in the API response');
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="w-5 h-5 mr-2" />
              AI Content Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/bible-content/ai-explanations')}
              >
                <Brain className="w-4 h-4 mr-2" />
                Review AI Explanations
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline" 
                disabled 
                title="AI generation not available in Phase 1"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Generate New Explanations (Phase 2)
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/bible-content/moderation')}
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                View Flagged Content
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Content Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline" disabled title="Content management not available in Phase 1">
                <BookOpen className="w-4 h-4 mr-2" />
                Manage Books & Chapters (Phase 2)
              </Button>
              <Button className="w-full justify-start" variant="outline" disabled title="Content editing not available in Phase 1">
                <FileText className="w-4 h-4 mr-2" />
                Edit Verses (Phase 2)
              </Button>
              <Button className="w-full justify-start" variant="outline" disabled title="Content import not available in Phase 1">
                <Upload className="w-4 h-4 mr-2" />
                Bulk Import (Phase 2)
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export { BibleContentDashboardContent }; 