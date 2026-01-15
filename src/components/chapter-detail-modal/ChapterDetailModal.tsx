import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BookOpen, Calendar, Edit, Trash2, Loader2, RotateCcw, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
// Only 4 experience levels matching user side (no Advanced Student or Scholar)
const CHAPTER_EXPERIENCE_LEVELS = [
  'NEW_TO_BIBLE',
  'SOME_KNOWLEDGE',
  'REGULAR_READER',
  'THEOLOGICAL_TRAINING'
] as const;
import {
  fetchChapterAIExplanationHistory,
  updateChapterAIExplanation,
  deleteChapterAIExplanation,
  regenerateChapterAIExplanation,
  type ChapterAIExplanationHistoryResponse,
  type UpdateAIExplanationRequest
} from '@/services/aiExplanationsApi';

// Map experience_level from API to UI labels (only 4 levels matching user side)
const mapExperienceLevel = (level: string | undefined): string => {
  if (!level) return 'Not specified';

  const levelMap: Record<string, string> = {
    'NEW_TO_BIBLE': 'First Time',
    'SOME_KNOWLEDGE': 'Some Knowledge',
    'REGULAR_READER': 'Regular Reader',
    'THEOLOGICAL_TRAINING': 'Theological Training'
  };

  return levelMap[level.toUpperCase()] || level;
};

// Convert markdown to HTML for proper display (like user side)
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

// Map tab labels to explanation types (matching backend API)
const mapTabLabelToExplanationType = (tabLabel: string): string => {
  const mapping: Record<string, string> = {
    'General Explanation': 'explanation',
    'Commentary': 'commentary',
    'Historical Context': 'historical_context',
    'Cultural Background': 'cultural_background',
    // Legacy mappings for backward compatibility
    'Explanation': 'explanation',
    'Original': 'original',
    'Source': 'source',
    'Ground Text Analysis': 'ground_text',
    'Special Insights': 'special',
    'Daily Life Application': 'practical_application',
    'Cross-References': 'cross_reference',
    'Commentary Insights': 'commentary',
    'Key Takeaways': 'key_takeaways',
    'Reflection Prompts': 'reflection',
    'Context': 'context'
  };
  return mapping[tabLabel] || tabLabel.toLowerCase().replace(/\s+/g, '_');
};

interface ChapterDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapter: {
    chapterId: string;
    book: string;
    chapter: number;
    tabName: string;
    experienceLevel?: string;
  } | null;
  onRefresh?: () => void; // Callback to refresh parent component data
}

const ChapterDetailModal: React.FC<ChapterDetailModalProps> = ({ isOpen, onClose, chapter, onRefresh }) => {
  const [chapterExplanationHistory, setChapterExplanationHistory] = useState<ChapterAIExplanationHistoryResponse['data'] | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editFormData, setEditFormData] = useState<UpdateAIExplanationRequest | null>(null);
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [currentExplanation, setCurrentExplanation] = useState<any | null>(null);

  // Load chapter explanation history
  const loadChapterExplanationHistory = useCallback(async () => {
    if (!chapter?.chapterId) return;

    try {
      setLoadingHistory(true);
      setHistoryError(null);
      const response = await fetchChapterAIExplanationHistory(chapter.chapterId);
      if (response.status === 1 && response.data) {
        setChapterExplanationHistory(response.data);
        
        // Find the specific explanation for the current tab and experience level
        // Only show explanations for the 4 allowed experience levels
        const experienceLevel = chapter.experienceLevel || 'NEW_TO_BIBLE';
        const allowedLevels = new Set(CHAPTER_EXPERIENCE_LEVELS);
        
        // Match by label first (preferred), then fallback to type mapping
        const explanation = response.data.explanations.find(
          (exp: any) => {
            const expLabel = exp.label;
            const expLevel = exp.experience_level;
            const matchesLabel = expLabel === chapter.tabName;
            const matchesExperienceLevel = expLevel === experienceLevel;
            const isAllowedLevel = allowedLevels.has(expLevel);
            
            // Only match if it's an allowed experience level
            if (!isAllowedLevel) {
              return false;
            }
            
            // First try to match by label (most accurate)
            if (matchesLabel && matchesExperienceLevel) {
              return true;
            }
            
            // Fallback: match by explanation type if label doesn't match
            if (!matchesLabel && matchesExperienceLevel) {
              const explanationType = mapTabLabelToExplanationType(chapter.tabName);
              const expType = exp.explanation_type || exp.context_type || exp.field_name;
              return expType === explanationType;
            }
            
            return false;
          }
        );
        
        setCurrentExplanation(explanation || null);
      } else {
        setHistoryError(response.message || 'Failed to load chapter explanation history');
        setCurrentExplanation(null);
      }
    } catch (error: any) {
      console.error('Error loading chapter explanation history:', error);
      setHistoryError(error?.response?.data?.message || error?.message || 'Failed to load chapter explanation history');
      setCurrentExplanation(null);
    } finally {
      setLoadingHistory(false);
    }
  }, [chapter?.chapterId, chapter?.tabName, chapter?.experienceLevel]);

  useEffect(() => {
    if (isOpen && chapter?.chapterId) {
      loadChapterExplanationHistory();
      setIsEditing(false);
      setIsDeleting(false);
      setEditFormData(null);
    } else {
      setChapterExplanationHistory(null);
      setHistoryError(null);
      setCurrentExplanation(null);
    }
  }, [isOpen, chapter?.chapterId, chapter?.tabName, chapter?.experienceLevel, loadChapterExplanationHistory]);

  if (!chapter) return null;

  const handleEdit = () => {
    if (!currentExplanation) {
      // If no explanation exists, create a new one with default values
      const experienceLevel = chapter.experienceLevel || 'NEW_TO_BIBLE';
      const explanationType = mapTabLabelToExplanationType(chapter.tabName);
      
      setEditFormData({
        explanation_type: explanationType,
        experience_level: experienceLevel,
        content: '',
        sources: []
      });
    } else {
      // Get explanation_type (use explanation_type if available, otherwise use context_type or category)
      const explanationType = currentExplanation.explanation_type || currentExplanation.context_type || currentExplanation.category || mapTabLabelToExplanationType(chapter.tabName);
      const experienceLevel = currentExplanation.experience_level || chapter.experienceLevel || 'NEW_TO_BIBLE';

      setEditFormData({
        explanation_type: explanationType,
        experience_level: experienceLevel,
        content: currentExplanation.content || '',
        sources: currentExplanation.sources || []
      });
    }
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFormData(null);
  };

  const handleSaveEdit = async () => {
    if (!chapter?.chapterId || !editFormData || !editFormData.content.trim()) {
      toast.error('Content is required');
      return;
    }

    try {
      setSaving(true);
      const response = await updateChapterAIExplanation(chapter.chapterId, editFormData);

      if (response.status === 1) {
        toast.success('Chapter explanation updated successfully');
        setIsEditing(false);
        setEditFormData(null);
        // Reload the explanation history
        await loadChapterExplanationHistory();
        // Notify parent component to refresh its data
        if (onRefresh) {
          onRefresh();
        }
      } else {
        toast.error(response.message || 'Failed to update chapter explanation');
      }
    } catch (error: any) {
      console.error('Error updating chapter explanation:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Failed to update chapter explanation');
    } finally {
      setSaving(false);
    }
  };

  const handleRegenerate = async () => {
    if (!chapter?.chapterId) {
      toast.error('Chapter ID is required');
      return;
    }

    const experienceLevel = chapter.experienceLevel || 'NEW_TO_BIBLE';
    const explanationType = mapTabLabelToExplanationType(chapter.tabName);

    try {
      setRegenerating(true);
      const response = await regenerateChapterAIExplanation(chapter.chapterId, {
        explanation_type: explanationType,
        experience_level: experienceLevel
      });

      if (response.status === 1) {
        toast.success('Chapter explanation regenerated successfully');
        // Reload the explanation history
        await loadChapterExplanationHistory();
        // Notify parent component to refresh its data
        if (onRefresh) {
          onRefresh();
        }
      } else {
        toast.error(response.message || 'Failed to regenerate chapter explanation');
      }
    } catch (error: any) {
      console.error('Error regenerating chapter explanation:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Failed to regenerate chapter explanation');
    } finally {
      setRegenerating(false);
    }
  };

  const handleDelete = async () => {
    if (!currentExplanation || !chapter?.chapterId) {
      toast.error('No explanation to delete');
      return;
    }

    // Confirm deletion
    if (!window.confirm('Are you sure you want to delete this chapter explanation? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(true);
      
      const explanationType = currentExplanation.explanation_type || currentExplanation.context_type || currentExplanation.category || mapTabLabelToExplanationType(chapter.tabName);
      const experienceLevel = currentExplanation.experience_level || chapter.experienceLevel || 'NEW_TO_BIBLE';
      
      const response = await deleteChapterAIExplanation(chapter.chapterId, explanationType, experienceLevel);

      if (response.status === 1) {
        toast.success('Chapter explanation deleted successfully');
        // Reload the explanation history
        await loadChapterExplanationHistory();
        // Notify parent component to refresh its data
        if (onRefresh) {
          onRefresh();
        }
      } else {
        toast.error(response.message || 'Failed to delete chapter explanation');
      }
    } catch (error: any) {
      console.error('Error deleting chapter explanation:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Failed to delete chapter explanation');
    } finally {
      setIsDeleting(false);
    }
  };

  const experienceLevel = chapter.experienceLevel || 'NEW_TO_BIBLE';
  const hasContent = currentExplanation?.has_content || (currentExplanation?.content && currentExplanation.content.trim().length > 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 w-[95vw] sm:w-full">
        <DialogHeader className="pr-8 sm:pr-6">
          <DialogTitle className="flex items-center gap-2 pr-2">
            <BookOpen className="w-5 h-5" />
            {chapter.book} - Chapter {chapter.chapter} - {chapter.tabName}
            <Badge className="bg-blue-100 text-blue-800 dark:bg-sand dark:text-white text-xs ml-2">
              {mapExperienceLevel(experienceLevel)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {loadingHistory ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
            <span className="ml-2 text-gray-600">Loading chapter explanations...</span>
          </div>
        ) : historyError ? (
          <div className="flex items-center justify-center py-8">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <span className="ml-2 text-red-600">{historyError}</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Chapter Metadata */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Chapter Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Book:</span>
                    <span className="font-medium">{chapter.book}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Chapter:</span>
                    <span className="font-medium">{chapter.chapter}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Section:</span>
                    <Badge variant="outline">{chapter.tabName}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Experience Level:</span>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-sand dark:text-white text-xs">
                      {mapExperienceLevel(experienceLevel)}
                    </Badge>
                  </div>
                  {chapterExplanationHistory?.metadata?.created_at && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Last Updated:</span>
                      <span className="text-sm">
                        {new Date(currentExplanation?.updated_at || chapterExplanationHistory.metadata.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {chapterExplanationHistory && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Total Explanations:</span>
                      <span className="font-medium">{chapterExplanationHistory.total_explanations}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tab Content */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{chapter.tabName}</CardTitle>
                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                            onClick={handleRegenerate}
                            disabled={isEditing || isDeleting || regenerating || loadingHistory}
                          >
                            {regenerating ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <RotateCcw className="w-4 h-4" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Regenerate</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEdit}
                      disabled={isEditing || isDeleting || loadingHistory}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      {currentExplanation ? 'Edit' : 'Create'}
                    </Button>
                    {currentExplanation && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDelete}
                        disabled={isEditing || isDeleting || loadingHistory}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        {isDeleting ? (
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4 mr-1" />
                        )}
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {!hasContent ? (
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      No explanation content available for this section. Click "Create" to add content.
                    </p>
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-300 p-4 rounded-lg">
                    <div 
                      className="text-gray-900 dark:bg-gray-300 dark:text-white leading-relaxed prose prose-sm max-w-none prose-headings:font-semibold prose-p:mb-4 prose-strong:font-semibold prose-code:bg-gray-200 prose-code:px-1 prose-code:rounded prose-pre:bg-gray-100 prose-pre:p-4 prose-pre:rounded prose-ul:list-disc prose-ol:list-decimal prose-li:ml-4"
                      dangerouslySetInnerHTML={{ __html: markdownToHtml(currentExplanation?.content) || 'No content available' }}
                    />
                    {currentExplanation?.sources && currentExplanation.sources.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-700 dark:text-white mb-2">Sources:</p>
                        <p className="text-sm text-gray-600 dark:text-white">
                          {Array.isArray(currentExplanation.sources) 
                            ? currentExplanation.sources.join(', ')
                            : currentExplanation.sources}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={handleCancelEdit}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 w-[95vw] sm:w-full">
          <DialogHeader className="pr-8 sm:pr-6">
            <DialogTitle className="pr-2">
              {currentExplanation ? 'Edit' : 'Create'} Chapter Explanation
            </DialogTitle>
            <DialogDescription>
              {currentExplanation ? 'Update' : 'Add'} the {chapter.tabName} content, experience level, and other details for {chapter.book} Chapter {chapter.chapter}.
            </DialogDescription>
          </DialogHeader>

          {editFormData && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="explanation_type">Explanation Type</Label>
                <Input
                  id="explanation_type"
                  value={editFormData.explanation_type}
                  onChange={(e) => setEditFormData({ ...editFormData, explanation_type: e.target.value })}
                  placeholder="e.g., explanation, context, historical_context"
                  disabled
                />
                <p className="text-xs text-gray-500">This field is automatically set based on the selected tab.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience_level">Experience Level</Label>
                <Select
                  value={editFormData.experience_level}
                  onValueChange={(value) => setEditFormData({ ...editFormData, experience_level: value })}
                >
                  <SelectTrigger id="experience_level">
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    {CHAPTER_EXPERIENCE_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {mapExperienceLevel(level)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={editFormData.content}
                  onChange={(e) => setEditFormData({ ...editFormData, content: e.target.value })}
                  placeholder="Enter chapter explanation content..."
                  rows={8}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sources">Sources (comma-separated)</Label>
                <Input
                  id="sources"
                  value={Array.isArray(editFormData.sources) ? editFormData.sources.join(', ') : (editFormData.sources || '')}
                  onChange={(e) => {
                    const sources = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                    setEditFormData({ ...editFormData, sources });
                  }}
                  placeholder="Source 1, Source 2, Source 3"
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
                <Button variant="outline" onClick={handleCancelEdit} disabled={saving} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit} disabled={saving || !editFormData.content.trim()} className="w-full sm:w-auto">
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    currentExplanation ? 'Save Changes' : 'Create Explanation'
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export { ChapterDetailModal };
