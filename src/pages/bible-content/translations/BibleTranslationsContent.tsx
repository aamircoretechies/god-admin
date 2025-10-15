import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Languages, 
  Plus, 
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

const languages = [
  'English', 'Spanish', 'French', 'German', 'Portuguese', 'Italian', 'Dutch', 'Russian',
  'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hebrew', 'Greek', 'Latin', 'Swedish',
  'Norwegian', 'Danish', 'Finnish', 'Polish', 'Czech', 'Hungarian', 'Romanian', 'Bulgarian'
];

const BibleTranslationsContent = () => {
  const [translations, setTranslations] = useState<Translation[]>(mockTranslations);
  const [isCreating, setIsCreating] = useState(false);
  const [editingTranslation, setEditingTranslation] = useState<Translation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [languageFilter, setLanguageFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
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

  const filteredTranslations = translations.filter(translation => {
    const matchesSearch = translation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         translation.version.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLanguage = languageFilter === 'all' || translation.language === languageFilter;
    const matchesStatus = statusFilter === 'all' || translation.status === statusFilter;
    return matchesSearch && matchesLanguage && matchesStatus;
  });

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
    setFormData(translation);
  };

  const handleSave = () => {
    if (editingTranslation) {
      setTranslations(translations.map(t => t.id === editingTranslation.id ? { ...formData, id: editingTranslation.id } as Translation : t));
      setEditingTranslation(null);
    } else {
      const newTranslation: Translation = {
        ...formData,
        id: Date.now().toString(),
        verseCount: 0,
        lastUpdated: new Date().toISOString().split('T')[0],
        fileSize: '0 KB'
      } as Translation;
      setTranslations([...translations, newTranslation]);
      setIsCreating(false);
    }
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

  const handleDelete = (id: string) => {
    setTranslations(translations.filter(t => t.id !== id));
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Version Code
                    </label>
                    <Input
                      value={formData.version}
                      onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                      placeholder="e.g., KJV"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Publisher
                    </label>
                    <Input
                      value={formData.publisher}
                      onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                      placeholder="e.g., Crossway"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  <label className="text-sm font-medium text-gray-700">
                    Public Translation
                  </label>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Upload Translation File</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </Button>
                    <p className="text-xs text-gray-500">
                      Supported formats: JSON, XML, TXT (Max 10MB)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-primary hover:bg-primary-dark">
                <Save className="w-4 h-4 mr-2" />
                {editingTranslation ? 'Update Translation' : 'Create Translation'}
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
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div>
              <Select value={languageFilter} onValueChange={setLanguageFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  {languages.map((language) => (
                    <SelectItem key={language} value={language}>
                      {language}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
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
                {filteredTranslations.length} translations
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Translations List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Languages className="w-5 h-5 mr-2" />
            Bible Translations ({filteredTranslations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTranslations.map((translation) => (
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
                    <span className="text-gray-600">{translation.language}</span>
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
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(translation)}>
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(translation.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { BibleTranslationsContent }; 