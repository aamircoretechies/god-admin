import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  X,
  Calendar,
  Target,
  FileText
} from 'lucide-react';

interface ReadingPlan {
  id: string;
  title: string;
  description: string;
  duration: string;
  durationType: 'daily' | 'weekly' | 'monthly';
  bibleBooks: string[];
  chapters: string[];
  readingGoal: string;
  reflectionContent: string;
  status: 'draft' | 'active' | 'completed';
  startDate: string;
  endDate: string;
}

const mockPlans: ReadingPlan[] = [
  {
    id: '1',
    title: '30-Day New Testament',
    description: 'Complete journey through the New Testament in 30 days',
    duration: '30',
    durationType: 'daily',
    bibleBooks: ['Matthew', 'Mark', 'Luke', 'John', 'Acts'],
    chapters: ['1-28', '1-16', '1-24', '1-21', '1-28'],
    readingGoal: 'Read one chapter per day',
    reflectionContent: 'Daily reflections on key themes and teachings',
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2024-02-14'
  },
  {
    id: '2',
    title: 'Psalms in 7 Days',
    description: 'Deep dive into the book of Psalms',
    duration: '7',
    durationType: 'daily',
    bibleBooks: ['Psalms'],
    chapters: ['1-150'],
    readingGoal: 'Read 20-25 psalms per day',
    reflectionContent: 'Focus on themes of praise, lament, and wisdom',
    status: 'active',
    startDate: '2024-01-20',
    endDate: '2024-01-27'
  }
];

const bibleBooks = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
  'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
  '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra',
  'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
  'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations',
  'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
  'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
  'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
  'Matthew', 'Mark', 'Luke', 'John', 'Acts',
  'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
  'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
  '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews',
  'James', '1 Peter', '2 Peter', '1 John', '2 John',
  '3 John', 'Jude', 'Revelation'
];

const ReadingPlanManagePage = () => {
  const [plans, setPlans] = useState<ReadingPlan[]>(mockPlans);
  const [isCreating, setIsCreating] = useState(false);
  const [editingPlan, setEditingPlan] = useState<ReadingPlan | null>(null);
  const [formData, setFormData] = useState<Partial<ReadingPlan>>({
    title: '',
    description: '',
    duration: '',
    durationType: 'daily',
    bibleBooks: [],
    chapters: [],
    readingGoal: '',
    reflectionContent: '',
    status: 'draft',
    startDate: '',
    endDate: ''
  });

  const handleCreateNew = () => {
    setIsCreating(true);
    setEditingPlan(null);
    setFormData({
      title: '',
      description: '',
      duration: '',
      durationType: 'daily',
      bibleBooks: [],
      chapters: [],
      readingGoal: '',
      reflectionContent: '',
      status: 'draft',
      startDate: '',
      endDate: ''
    });
  };

  const handleEdit = (plan: ReadingPlan) => {
    setEditingPlan(plan);
    setIsCreating(false);
    setFormData(plan);
  };

  const handleSave = () => {
    if (editingPlan) {
      setPlans(plans.map(p => p.id === editingPlan.id ? { ...formData, id: editingPlan.id } as ReadingPlan : p));
      setEditingPlan(null);
    } else {
      const newPlan: ReadingPlan = {
        ...formData,
        id: Date.now().toString()
      } as ReadingPlan;
      setPlans([...plans, newPlan]);
      setIsCreating(false);
    }
    setFormData({
      title: '',
      description: '',
      duration: '',
      durationType: 'daily',
      bibleBooks: [],
      chapters: [],
      readingGoal: '',
      reflectionContent: '',
      status: 'draft',
      startDate: '',
      endDate: ''
    });
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingPlan(null);
    setFormData({
      title: '',
      description: '',
      duration: '',
      durationType: 'daily',
      bibleBooks: [],
      chapters: [],
      readingGoal: '',
      reflectionContent: '',
      status: 'draft',
      startDate: '',
      endDate: ''
    });
  };

  const handleDelete = (id: string) => {
    setPlans(plans.filter(p => p.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Reading Plans</h1>
          <p className="text-gray-600 mt-2">Create and manage reading plans for your users</p>
        </div>
        <Button onClick={handleCreateNew} className="bg-primary hover:bg-primary-dark">
          <Plus className="w-4 h-4 mr-2" />
          Create New Plan
        </Button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingPlan) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                {editingPlan ? 'Edit Reading Plan' : 'Create New Reading Plan'}
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
                    Plan Title
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., 30-Day New Testament"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the reading plan..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration
                    </label>
                    <Input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration Type
                    </label>
                    <Select
                      value={formData.durationType}
                      onValueChange={(value) => setFormData({ ...formData, durationType: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <Input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bible Books
                  </label>
                  <Select
                    onValueChange={(value) => {
                      if (!formData.bibleBooks?.includes(value)) {
                        setFormData({
                          ...formData,
                          bibleBooks: [...(formData.bibleBooks || []), value]
                        });
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Bible books..." />
                    </SelectTrigger>
                    <SelectContent>
                      {bibleBooks.map((book) => (
                        <SelectItem key={book} value={book}>
                          {book}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.bibleBooks?.map((book, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer"
                        onClick={() => setFormData({
                          ...formData,
                          bibleBooks: formData.bibleBooks?.filter((_, i) => i !== index)
                        })}>
                        {book} <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chapters
                  </label>
                  <Input
                    value={formData.chapters?.join(', ')}
                    onChange={(e) => setFormData({
                      ...formData,
                      chapters: e.target.value.split(',').map(c => c.trim())
                    })}
                    placeholder="e.g., 1-28, 1-16, 1-24"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reading Goal
                  </label>
                  <Input
                    value={formData.readingGoal}
                    onChange={(e) => setFormData({ ...formData, readingGoal: e.target.value })}
                    placeholder="e.g., Read one chapter per day"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reflection Content
                  </label>
                  <Textarea
                    value={formData.reflectionContent}
                    onChange={(e) => setFormData({ ...formData, reflectionContent: e.target.value })}
                    placeholder="Add reflection questions or content..."
                    rows={4}
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
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-primary hover:bg-primary-dark">
                <Save className="w-4 h-4 mr-2" />
                {editingPlan ? 'Update Plan' : 'Create Plan'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Plans */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            Existing Reading Plans
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {plans.map((plan) => (
              <div key={plan.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{plan.title}</h3>
                      <p className="text-sm text-gray-600">{plan.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(plan.status)}>
                      {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(plan)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(plan.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{plan.duration} {plan.durationType}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{plan.readingGoal}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{plan.bibleBooks.length} books</span>
                  </div>
                  <div className="text-gray-600">
                    {plan.startDate} - {plan.endDate}
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

export { ReadingPlanManagePage }; 