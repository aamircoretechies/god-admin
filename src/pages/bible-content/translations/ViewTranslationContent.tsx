import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTranslationById, type TranslationDetailData } from '@/services/translationsApi';
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

// Language mapping: code -> display name
const languageMap: Record<string, string> = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  pt: 'Portuguese',
  it: 'Italian',
  nl: 'Dutch',
  ru: 'Russian',
  zh: 'Chinese',
  ja: 'Japanese',
  ko: 'Korean',
  ar: 'Arabic',
  he: 'Hebrew',
  el: 'Greek',
  la: 'Latin',
  sv: 'Swedish',
  no: 'Norwegian',
  da: 'Danish',
  fi: 'Finnish',
  pl: 'Polish',
  cs: 'Czech',
  hu: 'Hungarian',
  ro: 'Romanian',
  bg: 'Bulgarian'
};

// Transform API response to component format
const transformTranslation = (apiTranslation: TranslationDetailData): Translation => {
  // Normalize status
  const normalizeStatus = (status: string): 'active' | 'inactive' | 'pending' | 'draft' => {
    const lower = status.toLowerCase();
    if (lower === 'active') return 'active';
    if (lower === 'inactive') return 'inactive';
    if (lower === 'pending') return 'pending';
    return 'draft';
  };

  // Normalize visibility to boolean
  const isPublic = apiTranslation.status_configuration.visibility.toLowerCase() === 'public';

  return {
    id: apiTranslation.translation_id,
    name: apiTranslation.full_name,
    version: apiTranslation.abbreviation || apiTranslation.metadata.version_code || '',
    language: apiTranslation.status_configuration.language || '',
    description: apiTranslation.overview.description || '',
    status: normalizeStatus(apiTranslation.status_configuration.status),
    verseCount: apiTranslation.statistics.total_verses || 0,
    lastUpdated: apiTranslation.metadata.last_updated || '',
    fileSize: apiTranslation.statistics.file_size || '0 KB',
    publisher: apiTranslation.overview.publisher || '',
    year: apiTranslation.overview.year_published || '',
    license: apiTranslation.overview.license || '',
    isPublic: isPublic
  };
};

const ViewTranslationContent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [translation, setTranslation] = useState<Translation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTranslation = async () => {
      if (!id) {
        setError('Translation ID is missing');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const apiTranslation = await fetchTranslationById(id);

        if (apiTranslation) {
          const transformed = transformTranslation(apiTranslation);
          setTranslation(transformed);
        } else {
          setError('Translation not found');
        }
      } catch (err: any) {
        console.error('Error loading translation:', err);
        setError(err?.response?.data?.message || err?.message || 'Failed to load translation');
      } finally {
        setLoading(false);
      }
    };

    loadTranslation();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !translation) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Translation Not Found</h3>
        <p className="text-gray-600 mb-4">
          {error || "The translation you're looking for doesn't exist."}
        </p>
        <Button onClick={() => navigate('/bible-content/translations')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Translations
        </Button>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    // If it's already a formatted date string (like "October 16, 2025"), return as-is
    if (dateString.includes(',') && !dateString.includes('T')) {
      return dateString;
    }
    // Otherwise, try to parse and format it
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString; // Return original if parsing fails
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString; // Return original if any error occurs
    }
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
            <p className="text-gray-600 mt-1">
              {translation.version} • {translation.language}
            </p>
          </div>
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
              {translation.description && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                  <p className="text-gray-900">{translation.description}</p>
                </div>
              )}

              {(translation.publisher || translation.year) && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  {translation.publisher && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Publisher</h4>
                      <p className="text-gray-900">{translation.publisher}</p>
                    </div>
                  )}
                  {translation.year && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Year Published</h4>
                      <p className="text-gray-900">{translation.year}</p>
                    </div>
                  )}
                </div>
              )}

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
                    <h4 className="text-sm font-medium text-gray-700 dark:text-white">
                      Total Verses
                    </h4>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {translation.verseCount.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <h4 className="text-sm font-medium text-gray-700 dark:text-white">File Size</h4>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {translation.fileSize}
                  </p>
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
                <Badge
                  className={
                    translation.isPublic
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }
                >
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
              <Button variant="outline" className="w-full justify-start" disabled={true}>
                <Download className="w-4 h-4 mr-2" />
                Download File
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled={true}>
                <Upload className="w-4 h-4 mr-2" />
                Upload New Version
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled={true}>
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
