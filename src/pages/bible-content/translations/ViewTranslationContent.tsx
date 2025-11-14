import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Download, 
  Upload,
  Globe,
  FileText,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  Languages,
  BookOpen,
  Copy
} from 'lucide-react';

interface Translation {
  id: string;
  name: string;
  version: string;
  language: string;
  description: string;
  status: 'active' | 'inactive' | 'pending' | 'draft';
  verseCount: number;
  lastUpdated: string;
  fileSize: string;
  publisher: string;
  year: string;
  license: string;
  isPublic: boolean;
}

const mockTranslations: Translation[] = [
  {
    id: '1',
    name: 'King James Version',
    version: 'KJV',
    language: 'English',
    description: 'The King James Version is an English translation of the Christian Bible for the Church of England.',
    status: 'active',
    verseCount: 31102,
    lastUpdated: '2024-01-15',
    fileSize: '2.3 MB',
    publisher: 'Public Domain',
    year: '1611',
    license: 'Public Domain',
    isPublic: true
  },
  {
    id: '2',
    name: 'English Standard Version',
    version: 'ESV',
    language: 'English',
    description: 'The English Standard Version is an English translation of the Bible published in 2001.',
    status: 'active',
    verseCount: 31102,
    lastUpdated: '2024-01-10',
    fileSize: '2.1 MB',
    publisher: 'Crossway',
    year: '2001',
    license: 'ESV License',
    isPublic: true
  },
  {
    id: '3',
    name: 'New International Version',
    version: 'NIV',
    language: 'English',
    description: 'The New International Version is an English translation of the Bible first published in 1978.',
    status: 'active',
    verseCount: 31102,
    lastUpdated: '2024-01-12',
    fileSize: '2.0 MB',
    publisher: 'Biblica',
    year: '1978',
    license: 'NIV License',
    isPublic: true
  },
  {
    id: '4',
    name: 'Reina Valera',
    version: 'RV1960',
    language: 'Spanish',
    description: 'Reina Valera is a Spanish translation of the Bible first published in 1602.',
    status: 'pending',
    verseCount: 31102,
    lastUpdated: '2024-01-18',
    fileSize: '2.4 MB',
    publisher: 'Sociedades Bíblicas Unidas',
    year: '1960',
    license: 'Public Domain',
    isPublic: true
  },
  {
    id: '5',
    name: 'Nueva Versión Internacional',
    version: 'NVI',
    language: 'Spanish',
    description: 'The Nueva Versión Internacional is a Spanish translation of the Bible.',
    status: 'inactive',
    verseCount: 31102,
    lastUpdated: '2024-01-05',
    fileSize: '2.2 MB',
    publisher: 'Biblica',
    year: '1999',
    license: 'NVI License',
    isPublic: false
  }
];

const ViewTranslationContent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Find the translation by ID
  const translation = mockTranslations.find(t => t.id === id);

  if (!translation) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Translation Not Found</h3>
        <p className="text-gray-600 mb-4">The translation you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/bible-content/translations')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Translations
        </Button>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'draft':
        return <Badge className="bg-blue-100 text-blue-800">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
      case 'draft':
        return <FileText className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/bible-content/translations')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{translation.name}</h2>
            <p className="text-gray-600 mt-1">{translation.version} • {translation.language}</p>
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
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                <p className="text-gray-900">{translation.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Publisher</h4>
                  <p className="text-gray-900">{translation.publisher}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Year Published</h4>
                  <p className="text-gray-900">{translation.year}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium text-gray-700 mb-2">License</h4>
                <p className="text-gray-900">{translation.license}</p>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Verses</h4>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{translation.verseCount.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">File Size</h4>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{translation.fileSize}</p>
                </div>
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
                <span className="text-sm font-medium">Status</span>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(translation.status)}
                  {getStatusBadge(translation.status)}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Language</span>
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <Badge variant="outline">{translation.language}</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Visibility</span>
                <Badge className={translation.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {translation.isPublic ? 'Public' : 'Private'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-sm text-gray-600">{formatDate(translation.lastUpdated)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Languages className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Version Code</p>
                  <p className="text-sm text-gray-600">{translation.version}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Download className="w-4 h-4 mr-2" />
                Download File
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Upload className="w-4 h-4 mr-2" />
                Upload New Version
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Copy className="w-4 h-4 mr-2" />
                Duplicate Translation
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export { ViewTranslationContent };

