import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Save, X, Eye, AlertCircle, CheckCircle } from 'lucide-react';
import {
  fetchPromptDetail,
  updatePrompt,
  createPrompt,
  type UpdatePromptRequest,
  type CreatePromptRequest
} from '@/services/promptsApi';
import { toast } from 'sonner';

// Category options mapped to backend values
const CATEGORY_OPTIONS = [
  { value: 'VerseExplanation', label: 'Verse Explanation' },
  { value: 'PrayerGuide', label: 'Prayer Guide' },
  { value: 'StudyGuide', label: 'Study Guide' },
  { value: 'Reflection', label: 'Reflection' },
  { value: 'Devotional', label: 'Devotional' },
  { value: 'HistoricalContext', label: 'Historical Context' },
  { value: 'ChapterContext', label: 'Chapter Context' },
  { value: 'CharacterStudy', label: 'Character Study' },
  { value: 'YouthStudy', label: 'Youth Study' },
  { value: 'DeepStudy', label: 'Deep Study' },
  { value: 'Cultural', label: 'Cultural' },
  { value: 'Theological', label: 'Theological' },
  { value: 'Practical', label: 'Practical' },
  { value: 'Original', label: 'Original' },
  { value: 'Other', label: 'Other' }
];

// Target role options
const TARGET_ROLE_OPTIONS = [
  { value: 'AllUsers', label: 'All Users' },
  { value: 'PremiumOnly', label: 'Premium Only' },
  { value: 'AdminOnly', label: 'Admin Only' }
];

// const AddEditPromptContent: React.FC = () => {
const AddEditPromptContent = forwardRef((props, ref) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: '',
    targetRole: '',
    language: 'English',
    status: 'Active'
  });

  const [previewMode, setPreviewMode] = useState(false);

  // Fetch prompt data if in edit mode
  useEffect(() => {
    const loadPromptData = async () => {
      if (!isEditMode || !id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await fetchPromptDetail(id);
        if (response.status === 1 && response.data) {
          const data = response.data;
          setFormData({
            title: data.title || '',
            description: data.description || '',
            content: data.content || '',
            category: data.category || '',
            targetRole: data.target_role || '',
            language: data.language || 'English',
            status: data.status || 'Active'
          });
        } else {
          throw new Error(response.message || 'Failed to fetch prompt');
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to load prompt');
      } finally {
        setLoading(false);
      }
    };

    loadPromptData();
  }, [id, isEditMode]);

  const handleInputChange = (field: string, value: string | boolean) => {
    if (typeof value === 'string') {
      if (field === 'title') {
        const words = value.trim().split(/\s+/);
        const limit = 50;

        if (words.length > limit) {
          toast.error(`Title cannot exceed ${limit} words!`);
          return; // stop typing
        }
      }
      if (field === 'description') {
        const words = value.trim().split(/\s+/);
        const limit = 200;

        if (words.length > limit) {
          toast.error(`Description cannot exceed ${limit} words!`);
          return; // stop typing
        }
      }
    }
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    // Validate required fields
    if (
      !formData.title ||
      !formData.description ||
      !formData.content ||
      !formData.category ||
      !formData.targetRole
    ) {
      setError('Please fill in all required fields');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (isEditMode && id) {
        // Update existing prompt
        const updateData: UpdatePromptRequest = {
          title: formData.title,
          description: formData.description,
          content: formData.content,
          category: formData.category,
          targetRole: formData.targetRole,
          language: formData.language,
          status: formData.status
        };

        const response = await updatePrompt(id, updateData);
        if (response.status === 1) {
          navigate(`/ai-prompt-management/view/${id}`);
        } else {
          throw new Error(response.message || 'Failed to update prompt');
        }
      } else {
        // Create new prompt
        const createData: CreatePromptRequest = {
          title: formData.title,
          description: formData.description,
          content: formData.content,
          category: formData.category,
          targetRole: formData.targetRole,
          language: formData.language,
          isPublic: true // Default to public
        };

        const response = await createPrompt(createData);
        if (response.status === 1 && response.data) {
          navigate(`/ai-prompt-management/view/${response.data.template_id}`);
        } else {
          throw new Error(response.message || 'Failed to create prompt');
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to save prompt');
    } finally {
      setSaving(false);
    }
  };

  useImperativeHandle(ref, () => ({
    submit: handleSave,
    cancel: handleCancel
  }));

  const handleCancel = () => {
    if (isEditMode && id) {
      navigate(`/ai-prompt-management/view/${id}`);
    } else {
      navigate('/ai-prompt-management');
    }
  };

  const handlePreview = () => {
    setPreviewMode(!previewMode);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading prompt...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Form Header */}
      <div className="flex items-center justify-between">
        <div>
          {/* <h2 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Edit AI Prompt' : 'Create New AI Prompt'}
          </h2> */}
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            {isEditMode ? 'Edit AI Prompt' : 'Create New AI Prompt'}
          </h2>
          {/* <p className="text-gray-600 mt-1">
            {isEditMode ? 'Update AI prompt template' : 'Design AI prompt templates for biblical content generation'}
          </p> */}
          <p className="text-sm md:text-base text-gray-600 mt-1">
            {isEditMode
              ? 'Update AI prompt template'
              : 'Design AI prompt templates for biblical content generation'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="w-4 h-4 mr-2" />
            {previewMode ? 'Edit Mode' : 'Preview'}
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Prompt Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter prompt title..."
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of what this prompt does..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="h-32 resize-none overflow-auto"
                />
              </div>
            </CardContent>
          </Card>

          {/* Prompt Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                Prompt Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content">AI Prompt Template *</Label>
                <Textarea
                  id="content"
                  placeholder="Enter the AI prompt template. Use placeholders like {verse}, {chapter}, {book} for dynamic content..."
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  rows={8}
                  className="font-mono text-sm resize-none overflow-auto"
                />
                <p className="text-xs text-gray-500">
                  Available placeholders: {'{verse}'}, {'{chapter}'}, {'{book}'}, {'{user_name}'},{' '}
                  {'{date}'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Preview Card */}
          {previewMode && (
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-card p-4 rounded-lg  border border-gray-300">
                  <h3 className="font-semibold mb-2">{formData.title || 'Prompt Title'}</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {formData.description || 'Description'}
                  </p>
                  <div className=" p-3 rounded border border-gray-900 bg-card">
                    <p className="text-sm font-mono">
                      {formData.content || 'Prompt content will appear here...'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Settings Sidebar */}
        <div className="space-y-6">
          {/* Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category/Context *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetRole">Target Role *</Label>
                <Select
                  value={formData.targetRole}
                  onValueChange={(value) => handleInputChange('targetRole', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select target role" />
                  </SelectTrigger>
                  <SelectContent>
                    {TARGET_ROLE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language *</Label>
                <Select
                  value={formData.language}
                  onValueChange={(value) => handleInputChange('language', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Dutch">Dutch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={handleSave} className="w-full" disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : isEditMode ? 'Update Prompt' : 'Save Prompt'}
              </Button>
              <Button variant="outline" onClick={handleCancel} className="w-full" disabled={saving}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </CardContent>
          </Card>

          {/* Validation Status */}
          <Card>
            <CardHeader>
              <CardTitle>Validation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle
                  className={`w-4 h-4 ${formData.title ? 'text-green-600' : 'text-gray-400'}`}
                />
                <span className={`text-sm ${formData.title ? 'text-green-600' : 'text-gray-500'}`}>
                  Title is {formData.title ? 'valid' : 'required'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle
                  className={`w-4 h-4 ${formData.description ? 'text-green-600' : 'text-gray-400'}`}
                />
                <span
                  className={`text-sm ${formData.description ? 'text-green-600' : 'text-gray-500'}`}
                >
                  Description is {formData.description ? 'valid' : 'required'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle
                  className={`w-4 h-4 ${formData.content ? 'text-green-600' : 'text-gray-400'}`}
                />
                <span
                  className={`text-sm ${formData.content ? 'text-green-600' : 'text-gray-500'}`}
                >
                  Content is {formData.content ? 'valid' : 'required'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle
                  className={`w-4 h-4 ${formData.category ? 'text-green-600' : 'text-gray-400'}`}
                />
                <span
                  className={`text-sm ${formData.category ? 'text-green-600' : 'text-gray-500'}`}
                >
                  Category is {formData.category ? 'valid' : 'required'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle
                  className={`w-4 h-4 ${formData.targetRole ? 'text-green-600' : 'text-gray-400'}`}
                />
                <span
                  className={`text-sm ${formData.targetRole ? 'text-green-600' : 'text-gray-500'}`}
                >
                  Target role is {formData.targetRole ? 'valid' : 'required'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
});

// export { AddEditPromptContent };
export default AddEditPromptContent;
