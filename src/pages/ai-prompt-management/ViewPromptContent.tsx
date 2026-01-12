import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Edit,
  Copy,
  FileText,
  AlertCircle,
  Calendar,
  User,
  Tag,
  TrendingUp,
  CheckCircle,
  XCircle,
  Trash2
} from 'lucide-react';
import {
  fetchPromptDetail,
  deletePrompt,
  createPrompt,
  type PromptDetailResponse,
  type CreatePromptRequest
} from '@/services/promptsApi';
import { toast } from 'sonner';

const ViewPromptContent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [promptData, setPromptData] = useState<PromptDetailResponse | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [duplicating, setDuplicating] = useState(false);

  // Format category: "VerseExplanation" -> "Verse Explanation"
  const formatCategory = (category: string): string => {
    return category.replace(/([A-Z])/g, ' $1').trim();
  };

  // Format target_role: "AllUsers" -> "All Users"
  const formatTargetRole = (role: string): string => {
    return role.replace(/([A-Z])/g, ' $1').trim();
  };

  // Clean and format markdown content for better display
  const cleanMarkdown = (content: string): string => {
    if (!content) return '';

    let cleaned = content;

    // Remove bold markers (**text** -> text)
    cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, '$1');

    // Remove italic markers (*text* -> text) - simple approach
    // First handle cases where * is not part of **
    cleaned = cleaned.replace(/([^*])\*([^*]+?)\*([^*])/g, '$1$2$3');

    // Format numbered lists (keep the numbers, ensure proper spacing)
    cleaned = cleaned.replace(/^(\d+)\.\s+/gm, '$1. ');

    // Format bullet lists (convert - to •)
    cleaned = cleaned.replace(/^-\s+/gm, '• ');

    // Clean up multiple newlines (max 2 consecutive)
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

    // Trim each line but preserve structure
    cleaned = cleaned
      .split('\n')
      .map((line) => {
        // Don't trim list items or numbered items
        if (line.match(/^[•\d]\.\s/) || line.trim() === '') {
          return line;
        }
        return line.trim();
      })
      .join('\n');

    return cleaned;
  };

  // Format content with proper structure
  const formatContent = (content: string): React.ReactNode => {
    const cleaned = cleanMarkdown(content);
    const lines = cleaned.split('\n');

    return (
      <div className="space-y-3">
        {lines.map((line, index) => {
          const trimmedLine = line.trim();

          // Skip empty lines (they'll create spacing naturally)
          if (!trimmedLine) {
            return null;
          }

          // Check if it's a heading (all caps or ends with colon and is short)
          if (
            (trimmedLine.match(/^[A-Z][A-Z\s:]+$/) && trimmedLine.length < 60) ||
            (trimmedLine.endsWith(':') &&
              trimmedLine.length < 50 &&
              trimmedLine === trimmedLine.toUpperCase())
          ) {
            return (
              <h4
                key={index}
                className="font-semibold text-gray-900 mt-6 mb-3 first:mt-0 text-base"
              >
                {trimmedLine.replace(':', '')}
              </h4>
            );
          }

          // Check if it's a numbered list item
          if (trimmedLine.match(/^\d+\.\s/)) {
            return (
              <div key={index} className="ml-2 text-gray-700 leading-relaxed">
                {trimmedLine}
              </div>
            );
          }

          // Check if it's a bullet list item
          if (trimmedLine.startsWith('•')) {
            return (
              <div key={index} className="ml-2 text-gray-700 leading-relaxed">
                {trimmedLine}
              </div>
            );
          }

          // Regular paragraph
          return (
            <p key={index} className="text-gray-700 leading-relaxed">
              {trimmedLine}
            </p>
          );
        })}
      </div>
    );
  };

  // Fetch prompt detail
  useEffect(() => {
    const loadPromptDetail = async () => {
      if (!id) {
        setError('Prompt ID is missing');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetchPromptDetail(id);
        if (response.status === 1 && response.data) {
          setPromptData(response.data);
        } else {
          throw new Error(response.message || 'Failed to fetch prompt detail');
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to load prompt detail');
        setPromptData(null);
      } finally {
        setLoading(false);
      }
    };

    loadPromptDetail();
  }, [id]);

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      'Verse Explanation': 'bg-amber-100 text-amber-800',
      'Chapter Summary': 'bg-purple-100 text-purple-800',
      'Daily Reflection': 'bg-green-100 text-green-800',
      'Study Guide': 'bg-orange-100 text-orange-800',
      'Prayer Guide': 'bg-pink-100 text-pink-800',
      'Historical Context': 'bg-blue-100 text-blue-800',
      'Chapter Context': 'bg-indigo-100 text-indigo-800',
      Other: 'bg-gray-100 text-gray-800'
    };

    return (
      <Badge variant="default" className={colors[category] || 'bg-gray-100 text-gray-800'}>
        {category}
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'All Users':
        return <Badge variant="outline">All Users</Badge>;
      case 'Premium Only':
        return (
          <Badge variant="default" className="bg-purple-100 text-purple-800">
            Premium Only
          </Badge>
        );
      case 'Admin Only':
        return <Badge variant="destructive">Admin Only</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Active
          </Badge>
        );
      case 'Inactive':
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-600">
            Inactive
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
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

  const handleDelete = async () => {
    if (!id || !promptData) return;

    setDeleting(true);
    setError(null);

    try {
      const response = await deletePrompt(id);
      if (response.status === 1) {
        navigate('/ai-prompt-management');
      } else {
        throw new Error(response.message || 'Failed to delete prompt');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to delete prompt');
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleDuplicate = async () => {
    if (!promptData) return;

    setDuplicating(true);
    setError(null);

    try {
      // Create a copy of the prompt with "Copy of " prefix in title
      const duplicateData: CreatePromptRequest = {
        title: `Copy of ${promptData.title}`,
        description: promptData.description,
        content: promptData.content,
        category: promptData.category,
        targetRole: promptData.target_role,
        language: promptData.language,
        tags: promptData.tags || [],
        isPublic: promptData.is_public
      };

      const response = await createPrompt(duplicateData);
      if (response.status === 1 && response.data) {
        toast.success('Prompt duplicated successfully');
        navigate(`/ai-prompt-management/view/${response.data.template_id}`);
      } else {
        throw new Error(response.message || 'Failed to duplicate prompt');
      }
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || err?.message || 'Failed to duplicate prompt';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setDuplicating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading prompt preview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Prompt</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  if (!promptData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Prompt Found</h3>
          <p className="text-gray-600">The prompt you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const formattedCategory = formatCategory(promptData.category);
  const formattedTargetRole = formatTargetRole(promptData.target_role);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{promptData.title}</h2>
          <p className="text-gray-600 mt-1">{promptData.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleDuplicate} disabled={duplicating}>
            <Copy className="w-4 h-4 mr-2" />
            {duplicating ? 'Duplicating...' : 'Duplicate'}
          </Button>
          {/* View History - Commented out
          <Button variant="outline" asChild>
            <Link to={`/ai-prompt-management/history/${promptData.template_id}`}>
              <History className="w-4 h-4 mr-2" />
              View History
            </Link>
          </Button>
          */}
          <Button asChild>
            <Link to={`/ai-prompt-management/edit/${promptData.template_id}`}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Prompt
            </Link>
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
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="prose prose-sm max-w-none">{formatContent(promptData.content)}</div>
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
                {getStatusBadge(promptData.status)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Category</span>
                {getCategoryBadge(formattedCategory)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Target Role</span>
                {getRoleBadge(formattedTargetRole)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Language</span>
                <Badge variant="outline">{promptData.language}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Version</span>
                <Badge variant="outline">{promptData.version}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  Usage Count
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {promptData.usage_count}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Public</span>
                {promptData.is_public ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          {promptData.tags && promptData.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {promptData.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {promptData.creator && (
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Created By</p>
                    <p className="text-sm text-gray-600">{promptData.creator.email}</p>
                    <p className="text-xs text-gray-500">{promptData.creator.role}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Created On</p>
                  <p className="text-sm text-gray-600">{formatDate(promptData.created_at)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-sm text-gray-600">{formatDate(promptData.last_updated)}</p>
                </div>
              </div>
              <div className="pt-2 border-t">
                <p className="text-xs text-gray-500 font-mono break-all">
                  ID: {promptData.template_id}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to={`/ai-prompt-management/edit/${promptData.template_id}`}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Prompt
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleDuplicate}
                disabled={duplicating}
              >
                <Copy className="w-4 h-4 mr-2" />
                {duplicating ? 'Duplicating...' : 'Duplicate Prompt'}
              </Button>
              {/* View History - Commented out
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to={`/ai-prompt-management/history/${promptData.template_id}`}>
                  <History className="w-4 h-4 mr-2" />
                  View History
                </Link>
              </Button>
              */}
              <Button
                variant="outline"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={deleting}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Prompt
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                Confirm Delete
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete "{promptData.title}"? This action cannot be undone.
              </p>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
              <div className="flex gap-3">
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export { ViewPromptContent };
