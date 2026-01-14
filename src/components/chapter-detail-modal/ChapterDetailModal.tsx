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
import { VALID_EXPERIENCE_LEVELS } from '@/components/verse-detail-modal/VerseDetailModal';
import {
  fetchChapterAIExplanationHistory,
  updateChapterAIExplanation,
  deleteChapterAIExplanation,
  regenerateChapterAIExplanation,
  type ChapterAIExplanationHistoryResponse,
  type UpdateAIExplanationRequest
} from '@/services/aiExplanationsApi';

// Map experience_level from API to UI labels
const mapExperienceLevel = (level: string | undefined): string => {
  if (!level) return 'Not specified';

  const levelMap: Record<string, string> = {
    'NEW_TO_BIBLE': 'First Time',
    'SOME_KNOWLEDGE': 'Some Knowledge',
    'REGULAR_READER': 'Regular Reader',
    'REGULAR': 'Regular Reader',
    'OCCASIONAL': 'Occasionally',
    'OCCASIONALLY': 'Occasionally',
    'ADVANCED_STUDENT': 'Advanced Student',
    'THEOLOGICAL': 'Theological',
    'ADVANCED': 'Advanced Student',
    'SCHOLAR': 'Scholar'
  };

  return levelMap[level.toUpperCase()] || level;
};

// Map tab names to explanation types (matching backend)
const mapTabNameToExplanationType = (tabName: string): string => {
  const mapping: Record<string, string> = {
    'Explanation': 'explanation',
    'Original': 'original',
    'Source': 'source',
    'Historical Context': 'historical_context',
    'Ground Text Analysis': 'ground_text_analysis',
    'Special Insights': 'special_insights',
    'Daily Life Application': 'daily_life_application',
    'Cross-References': 'cross_references',
    'Commentary Insights': 'commentary_insights',
    'Key Takeaways': 'key_takeaways',
    'Reflection Prompts': 'reflection_prompts',
    'Context': 'context'
  };
  return mapping[tabName] || tabName.toLowerCase().replace(/\s+/g, '_');
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
        const experienceLevel = chapter.experienceLevel || 'NEW_TO_BIBLE';
        const explanationType = mapTabNameToExplanationType(chapter.tabName);
        
        const explanation = response.data.explanations.find(
          (exp: any) => {
            // Check both explanation_type and context_type (backend returns context_type)
            const expType = exp.explanation_type || exp.context_type || exp.field_name;
            return expType === explanationType && exp.experience_level === experienceLevel;
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
      const explanationType = mapTabNameToExplanationType(chapter.tabName);
      
      setEditFormData({
        explanation_type: explanationType,
        experience_level: experienceLevel,
        content: '',
        sources: []
      });
    } else {
      // Get explanation_type (use explanation_type if available, otherwise use context_type or category)
      const explanationType = currentExplanation.explanation_type || currentExplanation.context_type || currentExplanation.category || mapTabNameToExplanationType(chapter.tabName);
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
    const explanationType = mapTabNameToExplanationType(chapter.tabName);

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
      
      const explanationType = currentExplanation.explanation_type || currentExplanation.context_type || currentExplanation.category || mapTabNameToExplanationType(chapter.tabName);
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
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                    <p className="text-gray-900 dark:text-black leading-relaxed whitespace-pre-line">
                      {currentExplanation?.content || 'No content available'}
                    </p>
                    {currentExplanation?.sources && currentExplanation.sources.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sources:</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
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
                    {VALID_EXPERIENCE_LEVELS.map((level) => (
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
