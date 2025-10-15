import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  X,
  Brain,
  CheckCircle,
  AlertCircle,
  Clock,
  Eye,
  Send,
  Settings
} from 'lucide-react';

interface Content {
  id: string;
  planId: string;
  planTitle: string;
  day: number;
  type: 'reflection' | 'devotional' | 'ai_explanation' | 'question';
  title: string;
  content: string;
  status: 'draft' | 'pending' | 'approved' | 'published';
  aiGenerated: boolean;
  createdAt: string;
  updatedAt: string;
}

const mockContent: Content[] = [
  {
    id: '1',
    planId: '1',
    planTitle: '30-Day New Testament',
    day: 1,
    type: 'reflection',
    title: 'The Beginning of Good News',
    content: 'Today we begin our journey through the New Testament. Matthew opens with the genealogy of Jesus, connecting Him to the promises of the Old Testament...',
    status: 'published',
    aiGenerated: false,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    planId: '1',
    planTitle: '30-Day New Testament',
    day: 1,
    type: 'ai_explanation',
    title: 'AI Explanation: Matthew 1:1-17',
    content: 'This passage establishes Jesus\' royal lineage through King David and Abraham. The genealogy shows God\'s faithfulness to His promises...',
    status: 'pending',
    aiGenerated: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '3',
    planId: '2',
    planTitle: 'Psalms in 7 Days',
    day: 1,
    type: 'devotional',
    title: 'The Blessed Man',
    content: 'Psalm 1 introduces us to the theme of wisdom in the Psalter. The blessed person is one who delights in God\'s law...',
    status: 'approved',
    aiGenerated: false,
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20'
  },
  {
    id: '4',
    planId: '1',
    planTitle: '30-Day New Testament',
    day: 2,
    type: 'question',
    title: 'Reflection Questions: Matthew 1:18-25',
    content: '1. How does the story of Jesus\' birth demonstrate God\'s faithfulness?\n2. What does it mean that Jesus is called "Immanuel"?\n3. How does Joseph\'s response model obedience to God?',
    status: 'draft',
    aiGenerated: true,
    createdAt: '2024-01-16',
    updatedAt: '2024-01-16'
  }
];

const ReadingPlanContentPage = () => {
  const [content, setContent] = useState<Content[]>(mockContent);
  const [isCreating, setIsCreating] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [formData, setFormData] = useState<Partial<Content>>({
    planId: '',
    day: 1,
    type: 'reflection',
    title: '',
    content: '',
    status: 'draft',
    aiGenerated: false
  });

  const readingPlans = [
    { id: '1', title: '30-Day New Testament' },
    { id: '2', title: 'Psalms in 7 Days' },
    { id: '3', title: 'Gospel of John Study' }
  ];

  const filteredContent = content.filter(item => {
    const matchesPlan = selectedPlan === 'all' || item.planId === selectedPlan;
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    return matchesPlan && matchesType && matchesStatus;
  });

  const handleCreateNew = () => {
    setIsCreating(true);
    setEditingContent(null);
    setFormData({
      planId: '',
      day: 1,
      type: 'reflection',
      title: '',
      content: '',
      status: 'draft',
      aiGenerated: false
    });
  };

  const handleEdit = (contentItem: Content) => {
    setEditingContent(contentItem);
    setIsCreating(false);
    setFormData(contentItem);
  };

  const handleSave = () => {
    if (editingContent) {
      setContent(content.map(c => c.id === editingContent.id ? { ...formData, id: editingContent.id } as Content : c));
      setEditingContent(null);
    } else {
      const newContent: Content = {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      } as Content;
      setContent([...content, newContent]);
      setIsCreating(false);
    }
    setFormData({
      planId: '',
      day: 1,
      type: 'reflection',
      title: '',
      content: '',
      status: 'draft',
      aiGenerated: false
    });
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingContent(null);
    setFormData({
      planId: '',
      day: 1,
      type: 'reflection',
      title: '',
      content: '',
      status: 'draft',
      aiGenerated: false
    });
  };

  const handleDelete = (id: string) => {
    setContent(content.filter(c => c.id !== id));
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setContent(content.map(c => c.id === id ? { ...c, status: newStatus as any, updatedAt: new Date().toISOString().split('T')[0] } : c));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'reflection':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'devotional':
        return <FileText className="w-4 h-4 text-purple-600" />;
      case 'ai_explanation':
        return <Brain className="w-4 h-4 text-green-600" />;
      case 'question':
        return <FileText className="w-4 h-4 text-orange-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-600 mt-2">Manage reflections, devotionals, and AI-generated content</p>
        </div>
        <Button onClick={handleCreateNew} className="bg-primary hover:bg-primary-dark">
          <Plus className="w-4 h-4 mr-2" />
          Create Content
        </Button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingContent) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                {editingContent ? 'Edit Content' : 'Create New Content'}
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
                    Reading Plan
                  </label>
                  <Select
                    value={formData.planId}
                    onValueChange={(value) => setFormData({ ...formData, planId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select reading plan" />
                    </SelectTrigger>
                    <SelectContent>
                      {readingPlans.map((plan) => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Day
                    </label>
                    <Input
                      type="number"
                      value={formData.day}
                      onChange={(e) => setFormData({ ...formData, day: parseInt(e.target.value) })}
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content Type
                    </label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reflection">Reflection</SelectItem>
                        <SelectItem value="devotional">Devotional</SelectItem>
                        <SelectItem value="ai_explanation">AI Explanation</SelectItem>
                        <SelectItem value="question">Question</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter content title..."
                  />
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
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Enter content..."
                    rows={8}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.aiGenerated}
                    onCheckedChange={(checked) => setFormData({ ...formData, aiGenerated: checked })}
                  />
                  <label className="text-sm font-medium text-gray-700">
                    AI Generated Content
                  </label>
                </div>

                {formData.aiGenerated && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Brain className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-blue-800">
                        This content will be marked as AI-generated and may require review
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-primary hover:bg-primary-dark">
                <Save className="w-4 h-4 mr-2" />
                {editingContent ? 'Update Content' : 'Create Content'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  {readingPlans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="reflection">Reflection</SelectItem>
                  <SelectItem value="devotional">Devotional</SelectItem>
                  <SelectItem value="ai_explanation">AI Explanation</SelectItem>
                  <SelectItem value="question">Question</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Settings className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {filteredContent.length} items
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Content ({filteredContent.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredContent.map((contentItem) => (
              <div key={contentItem.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getTypeIcon(contentItem.type)}
                    <div>
                      <h3 className="font-semibold text-gray-900">{contentItem.title}</h3>
                      <p className="text-sm text-gray-600">
                        {contentItem.planTitle} - Day {contentItem.day}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(contentItem.status)}>
                      {contentItem.status.charAt(0).toUpperCase() + contentItem.status.slice(1)}
                    </Badge>
                    {contentItem.aiGenerated && (
                      <Badge className="bg-green-100 text-green-800">
                        <Brain className="w-3 h-3 mr-1" />
                        AI
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {contentItem.content}
                  </p>
                </div>

                <div className="flex justify-between items-center pt-3 border-t">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Created: {contentItem.createdAt}</span>
                    <span>Updated: {contentItem.updatedAt}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(contentItem)}>
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    {contentItem.status === 'pending' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleStatusChange(contentItem.id, 'approved')}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(contentItem.id)}
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

      {/* AI Content Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            AI Content Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-yellow-600" />
                <span className="font-medium">Pending Review</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {content.filter(c => c.aiGenerated && c.status === 'pending').length}
              </p>
              <p className="text-sm text-gray-600">AI-generated content awaiting approval</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="font-medium">Approved</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {content.filter(c => c.aiGenerated && c.status === 'approved').length}
              </p>
              <p className="text-sm text-gray-600">AI content approved for use</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Send className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Published</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {content.filter(c => c.aiGenerated && c.status === 'published').length}
              </p>
              <p className="text-sm text-gray-600">AI content live for users</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { ReadingPlanContentPage }; 