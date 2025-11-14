import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchTranslations, updateTranslation, type TranslationResponse } from '@/services/translationsApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Languages, 
  Edit, 
  Trash2, 
  Save,
  X,
  Upload,
  Download,
  Eye,
  Globe,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock
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

// Transform API response to component format
const transformTranslation = (apiTranslation: TranslationResponse): Translation => {
  // Format file size
  const formatFileSize = (sizeMb: number | null | undefined): string => {
    if (!sizeMb) return '0 KB';
    if (sizeMb < 1) return `${(sizeMb * 1024).toFixed(0)} KB`;
    return `${sizeMb.toFixed(2)} MB`;
  };

  return {
    id: apiTranslation.translation_id,
    name: apiTranslation.name,
    version: apiTranslation.abbreviation || '', // Map abbreviation to version
    language: apiTranslation.language || '',
    description: '', // API doesn't provide description
    status: (apiTranslation.status?.toLowerCase() || 'draft') as 'active' | 'inactive' | 'pending' | 'draft',
    verseCount: apiTranslation.total_verses || 0, // Map total_verses to verseCount
    lastUpdated: apiTranslation.last_updated 
      ? new Date(apiTranslation.last_updated).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    fileSize: formatFileSize(apiTranslation.file_size_mb), // Map file_size_mb to fileSize
    publisher: '', // API doesn't provide publisher
    year: '', // API doesn't provide year
    license: apiTranslation.license || '',
    isPublic: apiTranslation.is_public ?? true
  };
};

// Language mapping: code -> display name
const languageMap: Record<string, string> = {
  'en': 'English',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'pt': 'Portuguese',
  'it': 'Italian',
  'nl': 'Dutch',
  'ru': 'Russian',
  'zh': 'Chinese',
  'ja': 'Japanese',
  'ko': 'Korean',
  'ar': 'Arabic',
  'he': 'Hebrew',
  'el': 'Greek',
  'la': 'Latin',
  'sv': 'Swedish',
  'no': 'Norwegian',
  'da': 'Danish',
  'fi': 'Finnish',
  'pl': 'Polish',
  'cs': 'Czech',
  'hu': 'Hungarian',
  'ro': 'Romanian',
  'bg': 'Bulgarian'
};

// Get display name for language code
const getLanguageName = (code: string): string => {
  return languageMap[code] || code;
};

// Get language code from display name
const getLanguageCode = (name: string): string => {
  const entry = Object.entries(languageMap).find(([_, displayName]) => displayName === name);
  return entry ? entry[0] : name; // Return code if found, otherwise return as-is (might already be a code)
};

const languages = Object.values(languageMap);

const BibleTranslationsContent = () => {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingTranslation, setEditingTranslation] = useState<Translation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [languageFilter, setLanguageFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Translation>>({
    name: '',
    version: '',
    language: '',
    description: '',
    status: 'draft',
    publisher: '',
    year: '',
    license: '',
    isPublic: true
  });

  // Fetch translations from API
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchTranslations({
          page: currentPage,
          limit: 10,
          search: searchTerm || undefined,
          language: languageFilter !== 'all' ? languageFilter : undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined
        });

        console.log('Translations response:', response);

        // Check if response is valid
        if (!response) {
          throw new Error('No response received from API');
        }

        // API returns {success, data, metadata}
        if (response.success && response.data && Array.isArray(response.data)) {
          const transformedTranslations = response.data.map(transformTranslation);
          setTranslations(transformedTranslations);
          
          // Use metadata if available
          if (response.metadata) {
            setTotalPages(response.metadata.totalPages || 1);
            setTotalCount(response.metadata.total || transformedTranslations.length);
          } else {
            // Fallback if no metadata
            setTotalPages(1);
            setTotalCount(transformedTranslations.length);
          }
        } else {
          // Unexpected format
          console.warn('Unexpected response format:', response);
          setTranslations([]);
          setError('Unexpected response format from API');
        }
      } catch (err: any) {
        console.error('Error loading translations:', err);
        console.error('Error details:', {
          message: err?.message,
          response: err?.response,
          status: err?.response?.status,
          data: err?.response?.data
        });
        
        const errorMessage = err?.response?.data?.message 
          || err?.response?.data?.error
          || err?.message 
          || 'Failed to load translations';
        
        setError(errorMessage);
        setTranslations([]);
      } finally {
        setLoading(false);
      }
    };

    loadTranslations();
  }, [currentPage, searchTerm, languageFilter, statusFilter]);

  // Get unique languages from fetched translations
  const availableLanguages = useMemo(() => {
    const languagesSet = new Set<string>();
    translations.forEach(t => {
      if (t.language) languagesSet.add(t.language);
    });
    return Array.from(languagesSet).sort();
  }, [translations]);

  const filteredTranslations = translations;

  const handleCreateNew = () => {
    setIsCreating(true);
    setEditingTranslation(null);
    setFormData({
      name: '',
      version: '',
      language: '',
      description: '',
      status: 'draft',
      publisher: '',
      year: '',
      license: '',
      isPublic: true
    });
  };

  const handleEdit = (translation: Translation) => {
    setEditingTranslation(translation);
    setIsCreating(false);
    // Convert language code to display name for the form
    const languageDisplayName = getLanguageName(translation.language) || translation.language;
    setFormData({
      ...translation,
      language: languageDisplayName
    });
  };

  const handleSave = async () => {
    if (editingTranslation) {
      try {
        setSaving(true);
        setError(null);
        
        // Prepare API request data
        // Convert language display name back to code
        const languageCode = getLanguageCode(formData.language || '');
        
        const updateData = {
          name: formData.name || '',
          abbreviation: formData.version || '', // version maps to abbreviation
          language: languageCode,
          license: formData.license || '',
          is_public: formData.isPublic ?? true
        };

        const response = await updateTranslation(editingTranslation.id, updateData);
        
        if (response.success) {
          // Reload translations to get updated data
          const updatedResponse = await fetchTranslations({
            page: currentPage,
            limit: 10,
            search: searchTerm || undefined,
            language: languageFilter !== 'all' ? languageFilter : undefined,
            status: statusFilter !== 'all' ? statusFilter : undefined
          });

          if (updatedResponse.success && updatedResponse.data) {
            const transformedTranslations = updatedResponse.data.map(transformTranslation);
            setTranslations(transformedTranslations);
            
            if (updatedResponse.metadata) {
              setTotalPages(updatedResponse.metadata.totalPages || 1);
              setTotalCount(updatedResponse.metadata.total || transformedTranslations.length);
            }
          }
          
          setEditingTranslation(null);
          setFormData({
            name: '',
            version: '',
            language: '',
            description: '',
            status: 'draft',
            publisher: '',
            year: '',
            license: '',
            isPublic: true
          });
        } else {
          setError(response.message || 'Failed to update translation');
        }
      } catch (err: any) {
        console.error('Error updating translation:', err);
        setError(err?.response?.data?.message || err?.message || 'Failed to update translation');
      } finally {
        setSaving(false);
      }
    } else {
      // Create new translation - not implemented yet
      setIsCreating(false);
      setFormData({
        name: '',
        version: '',
        language: '',
        description: '',
        status: 'draft',
        publisher: '',
        year: '',
        license: '',
        isPublic: true
      });
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingTranslation(null);
    setFormData({
      name: '',
      version: '',
      language: '',
      description: '',
      status: 'draft',
      publisher: '',
      year: '',
      license: '',
      isPublic: true
    });
  };

  const handleDelete = async (id: string) => {
    // TODO: Implement delete API call
    // For now, just remove from local state
    setTranslations(translations.filter(t => t.id !== id));
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleLanguageFilterChange = (value: string) => {
    setLanguageFilter(value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-blue-100 text-blue-800';
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
      case 'draft':
        return <FileText className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  if (loading && translations.length === 0) {
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

  if (error && translations.length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create/Edit Form */}
      {(isCreating || editingTranslation) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Languages className="w-5 h-5 mr-2" />
                {editingTranslation ? 'Edit Translation' : 'Add New Translation'}
              </span>
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Translation Name
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., King James Version"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Version Code
                    </label>
                    <Input
                      value={formData.version}
                      onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                      placeholder="e.g., KJV"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Language
                    </label>
                    <Select
                      value={formData.language}
                      onValueChange={(value) => setFormData({ ...formData, language: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((language) => (
                          <SelectItem key={language} value={language}>
                            {language}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the translation..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Publisher
                    </label>
                    <Input
                      value={formData.publisher}
                      onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                      placeholder="e.g., Crossway"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Year
                    </label>
                    <Input
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      placeholder="e.g., 2001"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    License
                  </label>
                  <Input
                    value={formData.license}
                    onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                    placeholder="e.g., ESV License"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.isPublic}
                    onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
                  />
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Public Translation
                  </label>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-coal-100 rounded-lg ">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Upload Translation File</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full dark:border-gray-600 dark:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-white">
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </Button>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Supported formats: JSON, XML, TXT (Max 10MB)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                className="bg-primary hover:bg-primary-dark"
                disabled={saving}
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : (editingTranslation ? 'Update Translation' : 'Create Translation')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search translations..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            <div>
              <Select value={languageFilter} onValueChange={handleLanguageFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  {availableLanguages.length > 0 ? (
                    availableLanguages.map((language) => (
                      <SelectItem key={language} value={language}>
                        {language}
                      </SelectItem>
                    ))
                  ) : (
                    languages.map((language) => (
                      <SelectItem key={language} value={language}>
                        {language}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {totalCount > 0 ? totalCount : filteredTranslations.length} translations
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Translations List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Languages className="w-5 h-5 mr-2" />
              Bible Translations ({totalCount > 0 ? totalCount : filteredTranslations.length})
            </span>
            {loading && <span className="text-sm text-gray-500">Loading...</span>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-4 h-4" />
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}
          <div className="space-y-4">
            {filteredTranslations.length === 0 && !loading ? (
              <div className="text-center py-8 text-gray-500">
                <Languages className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No translations found</p>
              </div>
            ) : (
              filteredTranslations.map((translation) => (
              <div key={translation.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Languages className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{translation.name}</h3>
                      <p className="text-sm text-gray-600">{translation.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(translation.status)}>
                      {translation.status.charAt(0).toUpperCase() + translation.status.slice(1)}
                    </Badge>
                    {!translation.isPublic && (
                      <Badge className="bg-gray-100 text-gray-800">Private</Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{getLanguageName(translation.language) || translation.language}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{translation.verseCount.toLocaleString()} verses</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Updated: {translation.lastUpdated}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{translation.fileSize}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t">
                  <div className="text-sm text-gray-500">
                    {translation.publisher} • {translation.year} • {translation.license}
                  </div>
                  <div className="flex space-x-2">
                    <Link to={`/bible-content/translations/view/${translation.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(translation)}>
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" disabled={true}>
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(translation.id)}
                      disabled={true}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
              ))
            )}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t">
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1 || loading}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages || loading}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export { BibleTranslationsContent }; 