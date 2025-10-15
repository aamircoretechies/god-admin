import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Brain, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  Eye,
  Search,
  Filter,
  FileText,
  MessageSquare,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

interface AIExplanation {
  id: string;
  verseId: string;
  book: string;
  chapter: number;
  verse: number;
  verseText: string;
  explanation: string;
  status: 'pending' | 'approved' | 'rejected' | 'needs_review';
  aiGenerated: boolean;
  theologicalAccuracy: number;
  clarity: number;
  createdAt: string;
  updatedAt: string;
  reviewer?: string;
  feedback?: string;
  category: 'theological' | 'historical' | 'cultural' | 'linguistic' | 'general';
}

const mockExplanations: AIExplanation[] = [
  {
    id: '1',
    verseId: '1',
    book: 'Genesis',
    chapter: 1,
    verse: 1,
    verseText: 'In the beginning God created the heaven and the earth.',
    explanation: 'This verse establishes the fundamental truth that God is the Creator of all things. The Hebrew word "bara" (created) is used exclusively of God\'s creative activity and implies creation from nothing. This verse sets the foundation for all biblical theology.',
    status: 'approved',
    aiGenerated: true,
    theologicalAccuracy: 95,
    clarity: 90,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-16',
    reviewer: 'Dr. Smith',
    category: 'theological'
  },
  {
    id: '2',
    verseId: '2',
    book: 'Genesis',
    chapter: 1,
    verse: 2,
    verseText: 'And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.',
    explanation: 'This verse describes the initial state of creation before God began to organize and fill the earth. The Hebrew terms "tohu" (formless) and "bohu" (void) indicate a state of chaos and emptiness. The Spirit of God\'s movement suggests divine preparation for the creative work to follow.',
    status: 'pending',
    aiGenerated: true,
    theologicalAccuracy: 88,
    clarity: 85,
    createdAt: '2024-01-17',
    updatedAt: '2024-01-17',
    category: 'linguistic'
  }
];

const AIExplanationManagementContent = () => {
  const [explanations, setExplanations] = useState<AIExplanation[]>(mockExplanations);
  const [selectedExplanation, setSelectedExplanation] = useState<AIExplanation | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [formData, setFormData] = useState<Partial<AIExplanation>>({
    book: '',
    chapter: 1,
    verse: 1,
    verseText: '',
    explanation: '',
    status: 'pending',
    category: 'theological',
    theologicalAccuracy: 0,
    clarity: 0
  });

  const filteredExplanations = explanations.filter(explanation => {
    const matchesSearch = explanation.verseText.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         explanation.explanation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         explanation.book.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || explanation.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || explanation.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleCreateNew = () => {
    setIsCreating(true);
    setFormData({
      book: '',
      chapter: 1,
      verse: 1,
      verseText: '',
      explanation: '',
      status: 'pending',
      category: 'theological',
      theologicalAccuracy: 0,
      clarity: 0
    });
  };

  const handleSave = () => {
    if (isEditing) {
      setExplanations(explanations.map(e => e.id === isEditing ? { ...formData, id: isEditing } as AIExplanation : e));
      setIsEditing(null);
    } else {
      const newExplanation: AIExplanation = {
        ...formData,
        id: Date.now().toString(),
        aiGenerated: true,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      } as AIExplanation;
      setExplanations([...explanations, newExplanation]);
      setIsCreating(false);
    }
    setFormData({
      book: '',
      chapter: 1,
      verse: 1,
      verseText: '',
      explanation: '',
      status: 'pending',
      category: 'theological',
      theologicalAccuracy: 0,
      clarity: 0
    });
  };

  const handleCancel = () => {
    setIsCreating(false);
    setIsEditing(null);
    setSelectedExplanation(null);
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setExplanations(explanations.map(e => 
      e.id === id 
        ? { ...e, status: newStatus as any, updatedAt: new Date().toISOString().split('T')[0] }
        : e
    ));
  };

  const handleDelete = (id: string) => {
    setExplanations(explanations.filter(e => e.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'needs_review':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'needs_review':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getAccuracyColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Explanations</p>
                <p className="text-2xl font-bold text-gray-900">{explanations.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900">
                  {explanations.filter(e => e.status === 'pending').length}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {explanations.filter(e => e.status === 'approved').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Needs Review</p>
                <p className="text-2xl font-bold text-gray-900">
                  {explanations.filter(e => e.status === 'needs_review').length}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || isEditing) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                {isEditing ? 'Edit Explanation' : 'Create New Explanation'}
              </span>
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Book
                    </label>
                    <Input
                      value={formData.book}
                      onChange={(e) => setFormData({ ...formData, book: e.target.value })}
                      placeholder="e.g., Genesis"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chapter
                    </label>
                    <Input
                      type="number"
                      value={formData.chapter}
                      onChange={(e) => setFormData({ ...formData, chapter: parseInt(e.target.value) })}
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Verse
                    </label>
                    <Input
                      type="number"
                      value={formData.verse}
                      onChange={(e) => setFormData({ ...formData, verse: parseInt(e.target.value) })}
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verse Text
                  </label>
                  <Textarea
                    value={formData.verseText}
                    onChange={(e) => setFormData({ ...formData, verseText: e.target.value })}
                    placeholder="Enter the Bible verse text..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="theological">Theological</SelectItem>
                        <SelectItem value="historical">Historical</SelectItem>
                        <SelectItem value="cultural">Cultural</SelectItem>
                        <SelectItem value="linguistic">Linguistic</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="needs_review">Needs Review</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Explanation
                  </label>
                  <Textarea
                    value={formData.explanation}
                    onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                    placeholder="Enter the explanation..."
                    rows={8}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Theological Accuracy (%)
                    </label>
                    <Input
                      type="number"
                      value={formData.theologicalAccuracy}
                      onChange={(e) => setFormData({ ...formData, theologicalAccuracy: parseInt(e.target.value) })}
                      min="0"
                      max="100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Clarity (%)
                    </label>
                    <Input
                      type="number"
                      value={formData.clarity}
                      onChange={(e) => setFormData({ ...formData, clarity: parseInt(e.target.value) })}
                      min="0"
                      max="100"
                    />
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
                {isEditing ? 'Update Explanation' : 'Create Explanation'}
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search explanations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="needs_review">Needs Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="theological">Theological</SelectItem>
                  <SelectItem value="historical">Historical</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                  <SelectItem value="linguistic">Linguistic</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {filteredExplanations.length} explanations
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Explanations List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            AI Explanations ({filteredExplanations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredExplanations.map((explanation) => (
              <div key={explanation.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Brain className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {explanation.book} {explanation.chapter}:{explanation.verse}
                      </h3>
                      <p className="text-sm text-gray-600 italic">"{explanation.verseText}"</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(explanation.status)}>
                      {explanation.status.replace('_', ' ').charAt(0).toUpperCase() + explanation.status.slice(1).replace('_', ' ')}
                    </Badge>
                    <Badge className="bg-purple-100 text-purple-800">
                      {explanation.category.charAt(0).toUpperCase() + explanation.category.slice(1)}
                    </Badge>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {explanation.explanation}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <ThumbsUp className="w-4 h-4 text-gray-500" />
                    <span className={`font-medium ${getAccuracyColor(explanation.theologicalAccuracy)}`}>
                      Accuracy: {explanation.theologicalAccuracy}%
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-gray-500" />
                    <span className={`font-medium ${getAccuracyColor(explanation.clarity)}`}>
                      Clarity: {explanation.clarity}%
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Created: {explanation.createdAt}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">
                      {explanation.aiGenerated ? 'AI Generated' : 'Manual'}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(explanation.status)}
                    <span className="text-sm text-gray-600">
                      {explanation.reviewer ? `Reviewed by ${explanation.reviewer}` : 'Not reviewed'}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setSelectedExplanation(explanation)}>
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(explanation.id)}>
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    {explanation.status === 'pending' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleStatusChange(explanation.id, 'approved')}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(explanation.id)}
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

export { AIExplanationManagementContent }; 