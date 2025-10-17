import { useState } from 'react';
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
  const [translations] = useState<Translation[]>(mockTranslations);
  const [contentStats] = useState<ContentStats>(mockContentStats);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'inactive':
        return <Clock className="w-4 h-4 text-gray-600" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
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
                <p className="text-sm font-medium text-gray-600">Total Translations</p>
                <p className="text-2xl font-bold text-gray-900">{contentStats.totalTranslations}</p>
                <p className="text-sm text-green-600">+2 this month</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-full">
                <Languages className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Verses</p>
                <p className="text-2xl font-bold text-gray-900">{contentStats.totalVerses.toLocaleString()}</p>
                <p className="text-sm text-green-600">Across all translations</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AI Explanations</p>
                <p className="text-2xl font-bold text-gray-900">{contentStats.aiExplanations.toLocaleString()}</p>
                <p className="text-sm text-green-600">+1,250 this week</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Flagged Content</p>
                <p className="text-2xl font-bold text-gray-900">{contentStats.flaggedContent}</p>
                <p className="text-sm text-red-600">Needs review</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-600" />
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
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              Active Translations ({contentStats.activeTranslations})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {translations.filter(t => t.status === 'active').map((translation) => (
                <div key={translation.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{translation.name}</h3>
                    <p className="text-sm text-gray-600">{translation.language} • {translation.verseCount.toLocaleString()} verses</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-yellow-600" />
              Pending Updates ({contentStats.pendingUpdates})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {translations.filter(t => t.status === 'pending').map((translation) => (
                <div key={translation.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{translation.name}</h3>
                    <p className="text-sm text-gray-600">{translation.language} • {translation.verseCount.toLocaleString()} verses</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-gray-600" />
              Inactive Translations ({translations.filter(t => t.status === 'inactive').length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {translations.filter(t => t.status === 'inactive').map((translation) => (
                <div key={translation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{translation.name}</h3>
                    <p className="text-sm text-gray-600">{translation.language} • {translation.verseCount.toLocaleString()} verses</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
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
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Language</th>
                </tr>
              </thead>
              <tbody>
                {translations.map((translation) => (
                  <tr key={translation.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <h3 className="font-medium text-gray-900">{translation.name}</h3>
                        <p className="text-sm text-gray-600">{translation.version}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{translation.language}</td>
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