import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Edit, 
  Copy, 
  History, 
  Calendar,
  User,
  FileText,
  Tag,
  Globe,
  CheckCircle,
  XCircle
} from 'lucide-react';

const ViewPromptContent: React.FC = () => {
  // Mock prompt data
  const promptData = {
    id: '1',
    title: 'Verse Explanation Template',
    description: 'AI prompt for explaining biblical verses in simple terms',
    content: 'Please explain the following Bible verse in simple, easy-to-understand language. Include the historical context, key themes, and practical application for daily life. Focus on making the message accessible to readers of all backgrounds while maintaining theological accuracy.',
    category: 'Verse Explanation',
    targetRole: 'All Users',
    language: 'English',
    status: 'Active',
    createdBy: 'Admin User',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:20:00Z',
    version: 3
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
      case 'Inactive':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-600">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      'Verse Explanation': 'bg-amber-100 text-amber-800',
      'Chapter Summary': 'bg-purple-100 text-purple-800',
      'Daily Reflection': 'bg-green-100 text-green-800',
      'Study Guide': 'bg-orange-100 text-orange-800',
      'Prayer Guide': 'bg-pink-100 text-pink-800'
    };
    
    return (
      <Badge variant="default" className={colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {category}
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'All Users':
        return <Badge variant="secondary">All Users</Badge>;
      case 'Premium Only':
        return <Badge variant="default" className="bg-purple-100 text-purple-800">Premium Only</Badge>;
      case 'Admin Only':
        return <Badge variant="destructive">Admin Only</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{promptData.title}</h2>
          <p className="text-gray-600 mt-1">{promptData.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Copy className="w-4 h-4 mr-2" />
            Duplicate
          </Button>
          <Button variant="outline">
            <History className="w-4 h-4 mr-2" />
            View History
          </Button>
          <Button>
            <Edit className="w-4 h-4 mr-2" />
            Edit Prompt
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Prompt Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Prompt Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm font-mono whitespace-pre-wrap text-gray-800">
                  {promptData.content}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Usage Examples */}
          <Card>
            <CardHeader>
              <CardTitle>Usage Examples</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-amber-50 p-4 rounded-lg">
                <h4 className="font-semibold text-amber-900 mb-2">Example Input:</h4>
                <p className="text-sm text-amber-800">John 3:16 - "For God so loved the world..."</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Expected Output:</h4>
                <p className="text-sm text-green-800">
                  This verse explains God's love for humanity and the purpose of Jesus' coming. 
                  It teaches us about God's character, the value of human life, and the path to eternal life.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Status & Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                {getStatusBadge(promptData.status)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Category</span>
                {getCategoryBadge(promptData.category)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Target Role</span>
                {getRoleBadge(promptData.targetRole)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Language</span>
                <Badge variant="outline">{promptData.language}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Version</span>
                <Badge variant="outline">v{promptData.version}</Badge>
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
                <User className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Created By</p>
                  <p className="text-sm text-gray-600">{promptData.createdBy}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Created On</p>
                  <p className="text-sm text-gray-600">{formatDate(promptData.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-sm text-gray-600">{formatDate(promptData.updatedAt)}</p>
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
                <Edit className="w-4 h-4 mr-2" />
                Edit Prompt
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Copy className="w-4 h-4 mr-2" />
                Duplicate Prompt
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <History className="w-4 h-4 mr-2" />
                View History
              </Button>
              {promptData.status === 'Active' ? (
                <Button variant="outline" className="w-full justify-start text-orange-600">
                  <XCircle className="w-4 h-4 mr-2" />
                  Deactivate
                </Button>
              ) : (
                <Button variant="outline" className="w-full justify-start text-green-600">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Activate
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export { ViewPromptContent };
