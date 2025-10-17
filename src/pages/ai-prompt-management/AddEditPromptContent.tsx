import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { 
  Save, 
  X, 
  Eye, 
  Copy,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const AddEditPromptContent: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: '',
    targetRole: '',
    language: 'English',
    status: true
  });

  const [previewMode, setPreviewMode] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log('Saving prompt:', formData);
    // Add save logic here
  };

  const handleCancel = () => {
    console.log('Canceling...');
    // Add cancel logic here
  };

  const handlePreview = () => {
    setPreviewMode(!previewMode);
  };

  const handleDuplicate = () => {
    console.log('Duplicating prompt...');
    // Add duplicate logic here
  };

  return (
    <div className="space-y-6">
      {/* Form Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Create New AI Prompt</h2>
          <p className="text-gray-600 mt-1">Design AI prompt templates for biblical content generation</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="w-4 h-4 mr-2" />
            {previewMode ? 'Edit Mode' : 'Preview'}
          </Button>
          <Button variant="outline" onClick={handleDuplicate}>
            <Copy className="w-4 h-4 mr-2" />
            Duplicate
          </Button>
        </div>
      </div>

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
                  className="font-mono text-sm"
                />
                <p className="text-xs text-gray-500">
                  Available placeholders: {'{verse}'}, {'{chapter}'}, {'{book}'}, {'{user_name}'}, {'{date}'}
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
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">{formData.title || 'Prompt Title'}</h3>
                  <p className="text-sm text-gray-600 mb-3">{formData.description || 'Description'}</p>
                  <div className="bg-white p-3 rounded border">
                    <p className="text-sm font-mono">{formData.content || 'Prompt content will appear here...'}</p>
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
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Verse Explanation">Verse Explanation</SelectItem>
                    <SelectItem value="Chapter Summary">Chapter Summary</SelectItem>
                    <SelectItem value="Daily Reflection">Daily Reflection</SelectItem>
                    <SelectItem value="Study Guide">Study Guide</SelectItem>
                    <SelectItem value="Prayer Guide">Prayer Guide</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetRole">Target Role *</Label>
                <Select value={formData.targetRole} onValueChange={(value) => handleInputChange('targetRole', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Users">All Users</SelectItem>
                    <SelectItem value="Premium Only">Premium Only</SelectItem>
                    <SelectItem value="Admin Only">Admin Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language *</Label>
                <Select value={formData.language} onValueChange={(value) => handleInputChange('language', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Dutch">Dutch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="status">Status</Label>
                <Switch
                  id="status"
                  checked={formData.status}
                  onCheckedChange={(checked) => handleInputChange('status', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={handleSave} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Prompt
              </Button>
              <Button variant="outline" onClick={handleCancel} className="w-full">
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
                <CheckCircle className={`w-4 h-4 ${formData.title ? 'text-green-600' : 'text-gray-400'}`} />
                <span className={`text-sm ${formData.title ? 'text-green-600' : 'text-gray-500'}`}>
                  Title is {formData.title ? 'valid' : 'required'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className={`w-4 h-4 ${formData.description ? 'text-green-600' : 'text-gray-400'}`} />
                <span className={`text-sm ${formData.description ? 'text-green-600' : 'text-gray-500'}`}>
                  Description is {formData.description ? 'valid' : 'required'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className={`w-4 h-4 ${formData.content ? 'text-green-600' : 'text-gray-400'}`} />
                <span className={`text-sm ${formData.content ? 'text-green-600' : 'text-gray-500'}`}>
                  Content is {formData.content ? 'valid' : 'required'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className={`w-4 h-4 ${formData.category ? 'text-green-600' : 'text-gray-400'}`} />
                <span className={`text-sm ${formData.category ? 'text-green-600' : 'text-gray-500'}`}>
                  Category is {formData.category ? 'valid' : 'required'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className={`w-4 h-4 ${formData.targetRole ? 'text-green-600' : 'text-gray-400'}`} />
                <span className={`text-sm ${formData.targetRole ? 'text-green-600' : 'text-gray-500'}`}>
                  Target role is {formData.targetRole ? 'valid' : 'required'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export { AddEditPromptContent };
