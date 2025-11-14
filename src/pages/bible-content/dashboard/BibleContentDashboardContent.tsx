import { useState } from 'react';
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

const mockTranslations: Translation[] = [
  {
    id: '1',
    name: 'King James Version',
    version: 'KJV',
    language: 'English',
    status: 'active',
    verseCount: 31102,
    lastUpdated: '2024-01-15',
    fileSize: '2.3 MB'
  },
  {
    id: '2',
    name: 'English Standard Version',
    version: 'ESV',
    language: 'English',
    status: 'active',
    verseCount: 31102,
    lastUpdated: '2024-01-10',
    fileSize: '2.1 MB'
  },
  {
    id: '3',
    name: 'New International Version',
    version: 'NIV',
    language: 'English',
    status: 'active',
    verseCount: 31102,
    lastUpdated: '2024-01-12',
    fileSize: '2.0 MB'
  },
  {
    id: '4',
    name: 'Reina Valera',
    version: 'RV1960',
    language: 'Spanish',
    status: 'pending',
    verseCount: 31102,
    lastUpdated: '2024-01-18',
    fileSize: '2.4 MB'
  },
  {
    id: '5',
    name: 'Nueva Versión Internacional',
    version: 'NVI',
    language: 'Spanish',
    status: 'inactive',
    verseCount: 31102,
    lastUpdated: '2024-01-05',
    fileSize: '2.2 MB'
  }
];

const mockContentStats: ContentStats = {
  totalTranslations: 5,
  totalVerses: 155510,
  activeTranslations: 3,
  pendingUpdates: 1,
  aiExplanations: 12450,
  flaggedContent: 23
};

const BibleContentDashboardContent = () => {
  const navigate = useNavigate();
  const [translations] = useState<Translation[]>(mockTranslations);
  const [contentStats] = useState<ContentStats>(mockContentStats);

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
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Translations</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{contentStats.totalTranslations}</p>
                <p className="text-sm text-green-600 dark:text-green-400">+2 this month</p>
              </div>
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                <Languages className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Verses</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{contentStats.totalVerses.toLocaleString()}</p>
                <p className="text-sm text-green-600 dark:text-green-400">Across all translations</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">AI Explanations</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{contentStats.aiExplanations.toLocaleString()}</p>
                <p className="text-sm text-green-600 dark:text-green-400">+1,250 this week</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
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
              {translations.filter(t => t.status === 'active').map((translation) => (
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
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-yellow-600 dark:text-yellow-400" />
              Pending Updates ({contentStats.pendingUpdates})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {translations.filter(t => t.status === 'pending').map((translation) => (
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
              ))}
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
              {translations.filter(t => t.status === 'inactive').map((translation) => (
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
              ))}
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
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Language</th>
                </tr>
              </thead>
              <tbody>
                {translations.map((translation) => (
                  <tr 
                    key={translation.id} 
                    className="cursor-pointer border-b border-gray-200 dark:border-gray-200 hover:bg-gray-200 dark:hover:bg-coal-100 transition-colors"
                    onClick={() => navigate(`/bible-content/translations/view/${translation.id}`)}
                  >
                    <td className="py-3 px-4">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{translation.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{translation.version}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{translation.language}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

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
              <Button className="w-full justify-start" variant="outline">
                <Brain className="w-4 h-4 mr-2" />
                Review AI Explanations
              </Button>
              <Button className="w-full justify-start" variant="outline" disabled title="AI generation not available in Phase 1">
                <TrendingUp className="w-4 h-4 mr-2" />
                Generate New Explanations (Phase 2)
              </Button>
              <Button className="w-full justify-start" variant="outline">
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