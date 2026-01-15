import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
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
  ThumbsDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { fetchAIExplanations, fetchVerseAIExplanationHistory, updateAIExplanation, updateChapterAIExplanation, deleteAIExplanation, deleteChapterAIExplanation, fetchChapterAIExplanationHistory, type AIExplanationResponse, type AIExplanationsListResponse } from '@/services/aiExplanationsApi';
import { DummyDataIndicator } from '@/components/dummy-data-indicator';
import { toast } from "sonner";

// Convert markdown to HTML for proper display (same as ChapterDetailModal)
const markdownToHtml = (content: string | null | undefined): string => {
  if (!content) return '';
  
  let html = content;
  
  // First, clean up any existing HTML tags that shouldn't be there
  html = html.replace(/<\/?p>/g, '\n');
  
  // Decode HTML entities first
  html = html.replace(/&nbsp;/g, ' ');
  html = html.replace(/&amp;/g, '&');
  html = html.replace(/&lt;/g, '<');
  html = html.replace(/&gt;/g, '>');
  html = html.replace(/&quot;/g, '"');
  html = html.replace(/&#39;/g, "'");
  
  // Convert markdown headings to HTML
  html = html.replace(/^######\s+(.*)$/gm, '<h6>$1</h6>');
  html = html.replace(/^#####\s+(.*)$/gm, '<h5>$1</h5>');
  html = html.replace(/^####\s+(.*)$/gm, '<h4>$1</h4>');
  html = html.replace(/^###\s+(.*)$/gm, '<h3>$1</h3>');
  html = html.replace(/^##\s+(.*)$/gm, '<h2>$1</h2>');
  html = html.replace(/^#\s+(.*)$/gm, '<h1>$1</h1>');
  
  // Convert markdown bold (**text** or __text__) - do this first
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
  
  // Convert markdown italic (*text* or _text_) - do this after bold
  // Since bold is already converted, remaining single asterisks/underscores are italic
  html = html.replace(/\*([^*\n]+?)\*/g, '<em>$1</em>');
  html = html.replace(/_([^_\n]+?)_/g, '<em>$1</em>');
  
  // Convert markdown links [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // Convert markdown code blocks (```code```)
  html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
  html = html.replace(/`([^`\n]+)`/g, '<code>$1</code>');
  
  // Convert markdown horizontal rules
  html = html.replace(/^[-*]{3,}$/gm, '<hr />');
  
  // Convert line breaks first (split by double newlines for paragraphs)
  const paragraphs = html.split(/\n\s*\n/);
  html = paragraphs.map(para => {
    para = para.trim();
    if (!para) return '';
    
    // Check if it's a heading (already converted)
    if (para.match(/^<h[1-6]>/)) {
      return para;
    }
    
    // Check if it's a list
    const listItems = para.split('\n').filter(line => {
      const trimmed = line.trim();
      return trimmed.match(/^[-*+]\s+/) || trimmed.match(/^\d+\.\s+/);
    });
    
    if (listItems.length > 0) {
      // It's a list
      const isOrdered = listItems[0].trim().match(/^\d+\./);
      const tag = isOrdered ? 'ol' : 'ul';
      const items = listItems.map(item => {
        const text = item.replace(/^[-*+\d.]+\s+/, '').trim();
        return `<li>${text}</li>`;
      }).join('\n');
      return `<${tag}>${items}</${tag}>`;
    }
    
    // Regular paragraph - convert single newlines to <br />
    para = para.replace(/\n/g, '<br />');
    return `<p>${para}</p>`;
  }).filter(p => p).join('\n');
  
  // Clean up multiple spaces
  html = html.replace(/[ \t]{2,}/g, ' ');
  
  return html;
};

// Strip markdown for text previews (used in list view)
const stripMarkdownForPreview = (content: string | null | undefined): string => {
  if (!content) return '';
  let text = content;
  // Remove markdown headings
  text = text.replace(/^#{1,6}\s+/gm, '');
  // Remove markdown bold/italic
  text = text.replace(/\*\*([^*]+)\*\*/g, '$1');
  text = text.replace(/__([^_]+)__/g, '$1');
  text = text.replace(/\*([^*]+)\*/g, '$1');
  text = text.replace(/_([^_]+)_/g, '$1');
  // Remove markdown links but keep text
  text = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
  // Remove markdown code
  text = text.replace(/`([^`]+)`/g, '$1');
  text = text.replace(/```[\s\S]*?```/g, '');
  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, '');
  // Decode HTML entities
  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#39;/g, "'");
  return text.trim();
};

interface AIExplanation {
  id: string;
  contentId: string;
  contentType: 'verse' | 'chapter';
  verseId?: string; // Legacy field
  book: string;
  chapter: number;
  verse: number;
  verseText: string; // Dummy - not in API
  explanation: string;
  status: 'pending' | 'approved' | 'rejected' | 'needs_review' | 'Approved' | 'Rejected' | 'UnderReview';
  aiGenerated: boolean;
  theologicalAccuracy: number; // Dummy - not in API
  clarity: number; // Dummy - not in API
  createdAt: string;
  updatedAt: string;
  reviewer?: string;
  feedback?: string; // Dummy - not in API
  category: string;
  translation?: {
    full_name: string;
    abbreviation: string;
  };
  fieldName: string;
  experienceLevel?: string;
  label?: string;
  hasContent?: boolean;
  sources?: string[];
}

// Transform API response to component format
const transformExplanation = (apiData: AIExplanationResponse): AIExplanation => {
  const contentType = (apiData as any).content_type || (apiData.verse && apiData.verse.verse ? 'verse' : 'chapter');
  return {
    id: apiData.explanation_id,
    contentId: apiData.verse?.verse_id || (apiData as any).content_id || apiData.explanation_id.split('_')[0],
    contentType: contentType as 'verse' | 'chapter',
    verseId: apiData.verse?.verse_id,
    book: apiData.verse?.book || (apiData as any).book?.long_name || '',
    chapter: apiData.verse.chapter,
    verse: apiData.verse.verse,
    verseText: '', // Dummy - not in API
    explanation: apiData.content,
    status: apiData.status.toLowerCase() as 'pending' | 'approved' | 'rejected' | 'needs_review',
    aiGenerated: apiData.ai_generated,
    theologicalAccuracy: 0, // Dummy - not in API
    clarity: 0, // Dummy - not in API
    createdAt: new Date(apiData.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }),
    updatedAt: new Date(apiData.updated_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }),
    reviewer: apiData.reviewed_by || undefined,
    feedback: undefined, // Dummy - not in API
    category: apiData.category || 'general',
    translation: apiData.translation,
    fieldName: apiData.field_name,
    experienceLevel: apiData.experience_level,
    label: (apiData as any).label,
    hasContent: (apiData as any).has_content,
    sources: (apiData as any).sources
  };
};

const AIExplanationManagementContent = () => {
  const [explanations, setExplanations] = useState<AIExplanation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;
  const [selectedExplanation, setSelectedExplanation] = useState<AIExplanation | null>(null);
  const [loadingVerseText, setLoadingVerseText] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [experienceLevelFilter, setExperienceLevelFilter] = useState<string>('all');






  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, categoryFilter, searchTerm, experienceLevelFilter]);

  // Fetch explanations from API (with debounce for search)
  useEffect(() => {
    const loadExplanations = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchAIExplanations({
          page: currentPage,
          limit: pageSize,
          status: statusFilter !== 'all' ? statusFilter : undefined,
          category: categoryFilter !== 'all' ? categoryFilter : undefined,
          experience_level: experienceLevelFilter !== 'all' ? experienceLevelFilter : undefined,
          search: searchTerm || undefined
        });

        if (response.status === 1 && response.data) {
          const transformed = response.data.map(transformExplanation);
          setExplanations(transformed);

          if (response.metadata) {
            setTotalCount(response.metadata.total);
            setTotalPages(response.metadata.totalPages);
          } else {
            // Fallback for unexpected response structure
            setTotalCount(transformed.length);
            setTotalPages(Math.ceil(transformed.length / pageSize) || 1);
          }
        } else {
          throw new Error(response.message || 'Failed to fetch explanations');
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to load AI explanations');
        setExplanations([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      loadExplanations();
    }, searchTerm ? 500 : 0);

    return () => clearTimeout(debounceTimer);
  }, [currentPage, statusFilter, categoryFilter, searchTerm, experienceLevelFilter]);

  // Fetch verse text when modal opens
  useEffect(() => {
    const fetchVerseText = async () => {
      if (!selectedExplanation || !selectedExplanation.verseId) {
        return;
      }

      // If verse text is already available, skip
      if (selectedExplanation.verseText) {
        return;
      }

      try {
        setLoadingVerseText(true);
        const response = await fetchVerseAIExplanationHistory(selectedExplanation.verseId);

        if (response.status === 1 && response.data && response.data.verse_text) {
          setSelectedExplanation(prev => {
            if (!prev) return null;
            return {
              ...prev,
              verseText: response.data.verse_text
            };
          });
        }
      } catch (err: any) {
        console.error('Error fetching verse text:', err);
        // Silently fail - verse text is optional
      } finally {
        setLoadingVerseText(false);
      }
    };

    fetchVerseText();
  }, [selectedExplanation?.verseId]);

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

  // Apply client-side filtering as fallback to ensure filters work correctly
  const filteredExplanations = useMemo(() => {
    let filtered = [...explanations];

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(e => e.status.toLowerCase() === statusFilter.toLowerCase());
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(e => e.category === categoryFilter);
    }

    // Filter by experience level
    if (experienceLevelFilter !== 'all') {
      filtered = filtered.filter(e => e.experienceLevel === experienceLevelFilter);
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(e =>
        e.book.toLowerCase().includes(searchLower) ||
        e.explanation.toLowerCase().includes(searchLower) ||
        `${e.book} ${e.chapter}:${e.verse}`.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [explanations, statusFilter, categoryFilter, searchTerm]);

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

  const handleEdit = (id: string) => {
    const explanation = explanations.find(e => e.id === id);
    if (explanation) {
      setIsEditing(id);
      setFormData({
        book: explanation.book,
        chapter: explanation.chapter,
        verse: explanation.verse,
        verseText: explanation.verseText,
        explanation: explanation.explanation,
        status: explanation.status,
        category: explanation.category,
        theologicalAccuracy: explanation.theologicalAccuracy,
        clarity: explanation.clarity
      });
    }
  };

  const handleSave = async () => {
    if (isEditing) {
      const explanationToUpdate = explanations.find(e => e.id === isEditing);
      if (!explanationToUpdate) return;

      const updatePayload = {
        explanation_type: explanationToUpdate.fieldName || explanationToUpdate.category || 'general',
        experience_level: explanationToUpdate.experienceLevel || 'NEW_TO_BIBLE',
        content: formData.explanation || '',
        sources: explanationToUpdate.sources || []
      };

      const updatePromise = explanationToUpdate.contentType === 'chapter'
        ? updateChapterAIExplanation(explanationToUpdate.contentId, updatePayload)
        : updateAIExplanation(explanationToUpdate.contentId, updatePayload);

      toast.promise(updatePromise, {
        loading: 'Updating explanation...',
        success: (data) => {
          console.log(data);
          // setExplanations(explanations.map(e => e.id === isEditing ? { ...e, ...formData } as AIExplanation : e));
          setExplanations(explanations.map(e => e.id === isEditing ? { ...e, ...formData, updatedAt: new Date().toLocaleDateString("en-us", { year: "numeric", month: "short", day: "numeric", }) } as AIExplanation : e));
          // loadExplanations();
          setIsEditing(null);
          return 'Explanation updated successfully';
        },
        error: (err) => {
          return err?.response?.data?.message || err.message || 'Failed to update explanation';
        }
      });
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

  const handleDelete = async (id: string) => {
    const explanationToDelete = explanations.find(e => e.id === id);
    if (!explanationToDelete) return;

    const deletePromise = explanationToDelete.contentType === 'chapter'
      ? deleteChapterAIExplanation(explanationToDelete.contentId, explanationToDelete.fieldName, explanationToDelete.experienceLevel || 'NEW_TO_BIBLE')
      : deleteAIExplanation(explanationToDelete.contentId, explanationToDelete.fieldName, explanationToDelete.experienceLevel || 'NEW_TO_BIBLE');

    toast.promise(deletePromise, {
      loading: 'Deleting explanation...',
      success: () => {
        setExplanations(explanations.filter(e => e.id !== id));
        // Also clear selected explanation if it was deleted
        if (selectedExplanation?.id === id) {
          setSelectedExplanation(null);
        }
        // Clear editing state if the deleted item was being edited
        if (isEditing === id) {
          setIsEditing(null);
        }
        return 'Deleted successfully!';
      },
      error: (err) => {
        return err?.response?.data?.message || err.message || 'Failed to delete explanation';
      }
    });
  };

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    switch (s) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'needs_review':
      case 'underreview':
      case 'under_review':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    const s = status.toLowerCase();
    switch (s) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'needs_review':
      case 'underreview':
      case 'under_review':
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading AI explanations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <Card className="max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Explanations</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Explanations</p>
                <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
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
                      maxLength={50}
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
                    maxLength={500}
                    className="resize-none"
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
                    maxLength={5000}
                    className="resize-none"
                  />
                </div>

                {/* Theological Accuracy (%) and Clarity (%) fields commented out
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Theological Accuracy (%)
                    </label>
                    <Input
                      type="number"
                      value={formData.theologicalAccuracy}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        const clampedValue = Math.max(0, Math.min(100, value));
                        setFormData({ ...formData, theologicalAccuracy: clampedValue });
                      }}
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
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        const clampedValue = Math.max(0, Math.min(100, value));
                        setFormData({ ...formData, clarity: clampedValue });
                      }}
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
                */}
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
          {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4"> */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <div>
              <Select value={experienceLevelFilter} onValueChange={setExperienceLevelFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="NEW_TO_BIBLE">New to Bible</SelectItem>
                  <SelectItem value="REGULAR_READER">Regular Reader</SelectItem>
                  <SelectItem value="SCHOLARLY">Scholarly</SelectItem>
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
          {filteredExplanations.length === 0 ? (
            <div className="text-center py-12">
              <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Explanations Found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                  ? 'Try adjusting your filters to see more results.'
                  : 'No AI explanations available at the moment.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredExplanations.map((explanation) => (
                // <div key={explanation.id} className="p-4 border rounded-lg min-w-[600px]">
                <div key={explanation.id} className="p-4 border rounded-lg min-w-full lg:min-w-[600px]">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Brain className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {/* {explanation.book} {explanation.chapter}:{explanation.verse} */}
                          {explanation.book} {explanation.chapter}
                          {explanation.verse ? `:${explanation.verse}` : ''}
                          {explanation.translation && (
                            <span className="text-sm font-normal text-gray-500 ml-2">
                              ({explanation.translation.abbreviation})
                            </span>
                          )}
                        </h3>
                        {/* <p className="text-sm text-gray-600 italic flex items-center gap-1">
                          {explanation.verseText || 'Verse text not available'}
                          {!explanation.verseText && <DummyDataIndicator text="Verse text is not available in the API" />}
                        </p> */}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(explanation.status)}>
                        {explanation.status.replace('_', ' ').charAt(0).toUpperCase() + explanation.status.slice(1).replace('_', ' ')}
                      </Badge>
                      <Badge className="bg-purple-100 text-purple-800">
                        {explanation.label || (explanation.category.charAt(0).toUpperCase() + explanation.category.slice(1))}
                      </Badge>
                      {explanation.experienceLevel && (
                        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                          {explanation.experienceLevel.replace(/_/g, ' ')}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {stripMarkdownForPreview(explanation.explanation)}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3 text-sm">
                    {/* Theological Accuracy and Clarity display commented out
                  <div className="flex items-center space-x-2">
                    <ThumbsUp className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-600 flex items-center gap-1">
                      Accuracy: {explanation.theologicalAccuracy}%
                      <DummyDataIndicator text="Theological accuracy score is not available in the API" />
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-600 flex items-center gap-1">
                      Clarity: {explanation.clarity}%
                      <DummyDataIndicator text="Clarity score is not available in the API" />
                    </span>
                  </div>
                  */}
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
                      {/* <Button variant="outline" size="sm" onClick={() => handleEdit(explanation.id)}>
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button> */}
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t">
                  <div className="text-sm text-gray-600">
                    Showing page {currentPage} of {totalPages}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Details Modal */}
      <Dialog open={!!selectedExplanation} onOpenChange={() => setSelectedExplanation(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-200">
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
              <Brain className="w-5 h-5 text-purple-600" />
              AI Explanation Details
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 mt-1.5">
              {selectedExplanation && `${selectedExplanation.book} ${selectedExplanation.chapter}:${selectedExplanation.verse || 'no'}`}
            </DialogDescription>
          </DialogHeader>
          {selectedExplanation && (
            <div className="px-6 pb-6 pt-4 space-y-6">
              {/* Metadata Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Metadata</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Book</label>
                    <p className="text-sm text-gray-900 font-medium">{selectedExplanation.book}</p>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Chapter</label>
                    <p className="text-sm text-gray-900 font-medium">{selectedExplanation.chapter}</p>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Verse</label>
                    <p className="text-sm text-gray-900 font-medium">{selectedExplanation.verse || '-'}</p>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</label>
                    <div>
                      <Badge className={getStatusColor(selectedExplanation.status)}>
                        {selectedExplanation.status.replace('_', ' ').charAt(0).toUpperCase() + selectedExplanation.status.slice(1).replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Type</label>
                    <p className="text-sm text-gray-900 font-medium">{selectedExplanation.label || (selectedExplanation.category.charAt(0).toUpperCase() + selectedExplanation.category.slice(1))}</p>
                  </div>
                  {selectedExplanation.experienceLevel && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Experience Level</label>
                      <p className="text-sm text-gray-900 font-medium">{selectedExplanation.experienceLevel.replace(/_/g, ' ')}</p>
                    </div>
                  )}
                  {selectedExplanation.translation && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Translation</label>
                      <p className="text-sm text-gray-900 font-medium">
                        {selectedExplanation.translation.full_name} ({selectedExplanation.translation.abbreviation})
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Verse Text Section */}
              <div className="space-y-2 pt-2 border-t border-gray-200">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Verse Text</label>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  {loadingVerseText ? (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
                      Loading verse text...
                    </div>
                  ) : (
                    <p className="text-sm text-gray-700 italic leading-relaxed">
                      {selectedExplanation.verseText || 'Verse text not available'}
                    </p>
                  )}
                </div>
              </div>

              {/* Explanation Section */}
              <div className="space-y-2 pt-2 border-t border-gray-200">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Explanation</label>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div 
                    className="text-sm text-gray-700 leading-relaxed prose prose-sm max-w-none prose-headings:font-semibold prose-p:mb-4 prose-strong:font-semibold prose-code:bg-gray-200 prose-code:px-1 prose-code:rounded prose-pre:bg-gray-100 prose-pre:p-4 prose-pre:rounded prose-ul:list-disc prose-ol:list-decimal prose-li:ml-4"
                    dangerouslySetInnerHTML={{ __html: markdownToHtml(selectedExplanation.explanation) || 'No content available' }}
                  />
                </div>
              </div>

              {/* Sources Section */}
              {selectedExplanation.sources && selectedExplanation.sources.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-gray-200">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Sources</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedExplanation.sources.map((source, index) => (
                      <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100">
                        {source.replace(/_/g, ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Timestamps Section */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Created At</label>
                  <p className="text-sm text-gray-900">{selectedExplanation.createdAt}</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Updated At</label>
                  <p className="text-sm text-gray-900">{selectedExplanation.updatedAt}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { AIExplanationManagementContent };
