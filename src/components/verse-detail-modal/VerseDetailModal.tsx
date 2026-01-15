import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  BookOpen,
  Calendar,
  History,
  Brain,
  Loader2,
  AlertCircle,
  FileText,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import {
  fetchVerseAIExplanationHistory,
  deleteAIExplanation,
  updateAIExplanation,
  regenerateVerseAIExplanation,
  type VerseAIExplanationHistoryResponse,
  type UpdateAIExplanationRequest
} from '@/services/aiExplanationsApi';
import { toast } from 'sonner';

interface VerseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  verse: {
    id: string;
    verseId?: string; // UUID verse_id for API calls
    book: string;
    chapter: number;
    verse: number;
    text: string;
    translation: string;
    language: string;
    createdAt: string;
    updatedAt: string;
  };
}

// Valid experience levels as per backend validation
export const VALID_EXPERIENCE_LEVELS = [
  'NEW_TO_BIBLE',
  'SOME_KNOWLEDGE',
  'REGULAR_READER',
  'ADVANCED_STUDENT',
  'SCHOLAR'
] as const;

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

const VerseDetailModal: React.FC<VerseDetailModalProps> = ({ isOpen, onClose, verse }) => {
  const [aiExplanationHistory, setAIExplanationHistory] = useState<VerseAIExplanationHistoryResponse['data'] | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5); // Number of explanations per page
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingExplanation, setEditingExplanation] = useState<any | null>(null);
  const [editFormData, setEditFormData] = useState<UpdateAIExplanationRequest | null>(null);
  const [saving, setSaving] = useState(false);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);

  const loadAIExplanationHistory = useCallback(async () => {
    if (!verse?.verseId) return;

    try {
      setLoadingHistory(true);
      setHistoryError(null);
      const response = await fetchVerseAIExplanationHistory(verse.verseId);
      if (response.status === 1 && response.data) {
        setAIExplanationHistory(response.data);
      } else {
        setHistoryError(response.message || 'Failed to load AI explanation history');
      }
    } catch (error: any) {
      console.error('Error loading AI explanation history:', error);
      setHistoryError(error?.response?.data?.message || error?.message || 'Failed to load AI explanation history');
    } finally {
      setLoadingHistory(false);
    }
  }, [verse?.verseId]);

  useEffect(() => {
    if (isOpen && verse?.verseId) {
      loadAIExplanationHistory();
      setCurrentPage(1); // Reset to first page when modal opens
    } else {
      setAIExplanationHistory(null);
      setHistoryError(null);
      setCurrentPage(1);
    }
  }, [isOpen, verse?.verseId, loadAIExplanationHistory]);

  // Calculate pagination
  const totalExplanations = aiExplanationHistory?.explanations?.length || 0;
  const totalPages = Math.ceil(totalExplanations / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedExplanations = aiExplanationHistory?.explanations?.slice(startIndex, endIndex) || [];

  const handleEditExplanation = (explanation: any) => {
    // Get explanation_type (use explanation_type if available, otherwise use context_type or category)
    const explanationType = explanation.explanation_type || explanation.context_type || explanation.category || 'general';
    const experienceLevel = explanation.experience_level || 'NEW_TO_BIBLE';

    setEditingExplanation(explanation);
    setEditFormData({
      explanation_type: explanationType,
      experience_level: experienceLevel,
      content: explanation.content || '',
      sources: explanation.sources || []
    });
  };

  const handleSaveEdit = async () => {
    if (!verse?.verseId || !editFormData) return;

    try {
      setSaving(true);
      const response = await updateAIExplanation(verse.verseId, editFormData);

      if (response.status === 1) {
        toast.success('Explanation updated successfully');
        setEditingExplanation(null);
        setEditFormData(null);
        // Reload the explanation history
        await loadAIExplanationHistory();
      } else {
        toast.error(response.message || 'Failed to update explanation');
      }
    } catch (error: any) {
      console.error('Error updating explanation:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Failed to update explanation');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingExplanation(null);
    setEditFormData(null);
  };

  const handleDeleteExplanation = async (explanation: any) => {
    if (!verse?.verseId) return;

    // Confirm deletion
    if (!window.confirm('Are you sure you want to delete this explanation? This action cannot be undone.')) {
      return;
    }

    try {
      // Get explanation_type and experience_level
      const explanationType = explanation.explanation_type || explanation.context_type || explanation.category || 'general';
      const experienceLevel = explanation.experience_level || 'NEW_TO_BIBLE';

      setDeletingId(explanation.explanation_id);
      const response = await deleteAIExplanation(verse.verseId, explanationType, experienceLevel);

      if (response.status === 1) {
        toast.success('Explanation deleted successfully');
        // Reload the explanation history
        await loadAIExplanationHistory();
        // Adjust page if current page becomes empty
        if (paginatedExplanations.length === 1 && currentPage > 1) {
          setCurrentPage(prev => Math.max(1, prev - 1));
        }
      } else {
        toast.error(response.message || 'Failed to delete explanation');
      }
    } catch (error: any) {
      console.error('Error deleting explanation:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Failed to delete explanation');
    } finally {
      setDeletingId(null);
    }
  };

  const handleRegenerateExplanation = async (explanation: any) => {
    if (!verse?.verseId) return;

    // Confirm regeneration
    if (!window.confirm('Are you sure you want to regenerate this explanation? This will replace the current content with a new AI-generated explanation.')) {
      return;
    }

    try {
      // Get explanation_type and experience_level
      const explanationType = explanation.explanation_type || explanation.context_type || explanation.category || 'general';
      const experienceLevel = explanation.experience_level || 'NEW_TO_BIBLE';

      setRegeneratingId(explanation.explanation_id);
      const response = await regenerateVerseAIExplanation(verse.verseId, {
        explanation_type: explanationType,
        experience_level: experienceLevel
      });

      if (response.status === 1) {
        toast.success('Explanation regenerated successfully');
        // Reload the explanation history
        await loadAIExplanationHistory();
      } else {
        toast.error(response.message || 'Failed to regenerate explanation');
      }
    } catch (error: any) {
      console.error('Error regenerating explanation:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Failed to regenerate explanation');
    } finally {
      setRegeneratingId(null);
    }
  };

  if (!verse) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            {verse.book} {verse.chapter}:{verse.verse}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Verse Text */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Verse Text</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-200 dark:bg-coal-100 p-4 rounded-lg">
                <p className="text-lg leading-relaxed italic">"{verse.text}"</p>
              </div>
            </CardContent>
          </Card>

          {/* Verse Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Verse Metadata</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Book:</span>
                  <span className="font-medium">{verse.book}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Chapter:</span>
                  <span className="font-medium">{verse.chapter}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Verse:</span>
                  <span className="font-medium">{verse.verse}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Translation:</span>
                  <Badge variant="outline">{verse.translation}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Language:</span>
                  {/* <Badge variant="secondary">{verse.language}</Badge> */}
                  <Badge variant="outline">{verse.language}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Created:</span>
                  <span className="text-sm">{new Date(verse.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Explanation History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI Explanation History
                {aiExplanationHistory && (
                  <Badge variant="outline" className="ml-2">
                    {aiExplanationHistory.total_explanations} total
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loadingHistory ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    <span className="ml-2 text-sm text-gray-600">Loading AI explanation history...</span>
                  </div>
                ) : historyError ? (
                  <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800/30">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <p className="text-sm text-red-600 dark:text-red-400">{historyError}</p>
                  </div>
                ) : !verse.verseId ? (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                    <p className="text-sm">Verse ID not available</p>
                  </div>
                ) : aiExplanationHistory ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Explanations</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-black">
                          {aiExplanationHistory.total_explanations}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">With Content</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-black">
                          {aiExplanationHistory.explanations_with_content}
                        </p>
                      </div>
                    </div>

                    {totalExplanations > 0 ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            Explanations ({totalExplanations})
                          </h4>
                          {totalPages > 1 && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                Page {currentPage} of {totalPages}
                              </span>
                            </div>
                          )}
                        </div>
                        {paginatedExplanations.map((explanation, index) => (
                          <div
                            key={explanation.explanation_id || index}
                            className="p-4 border rounded-lg border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs text-gray-900">
                                  {explanation.category || explanation.label || 'General'}
                                </Badge>
                                {explanation.context_type && (
                                  <Badge variant="secondary" className="text-xs text-gray-900">
                                    {explanation.context_type}
                                  </Badge>
                                )}
                                {explanation.experience_level && (
                                  <Badge  className="bg-blue-100 text-blue-800 dark:bg-gray-300 dark:text-blue-300 text-xs ">
                                    {mapExperienceLevel(explanation.experience_level)}
                                  </Badge>
                                )}
                                {explanation.has_content ? (
                                  <Badge className="bg-green-100 text-green-800 dark:bg-black dark:text-green-300 text-xs">
                                    Has Content
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-xs">
                                    No Content
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRegenerateExplanation(explanation)}
                                  disabled={regeneratingId === explanation.explanation_id || editingExplanation?.explanation_id === explanation.explanation_id}
                                  title="Regenerate explanation using AI"
                                >
                                  {regeneratingId === explanation.explanation_id ? (
                                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                  ) : (
                                    <RotateCcw className="w-3 h-3 mr-1" />
                                  )}
                                  Regenerate
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditExplanation(explanation)}
                                  disabled={regeneratingId === explanation.explanation_id}
                                >
                                  <Edit className="w-3 h-3 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteExplanation(explanation)}
                                  disabled={deletingId === explanation.explanation_id || regeneratingId === explanation.explanation_id}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                  {deletingId === explanation.explanation_id ? (
                                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-3 h-3 mr-1" />
                                  )}
                                  Delete
                                </Button>
                              </div>
                            </div>
                            {explanation.content && (
                              <div className="mt-2 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                                <div 
                                  className="text-gray-900 dark:text-black leading-relaxed prose prose-sm max-w-none prose-headings:font-semibold prose-p:mb-4 prose-strong:font-semibold prose-code:bg-gray-200 prose-code:px-1 prose-code:rounded prose-pre:bg-gray-100 prose-pre:p-4 prose-pre:rounded prose-ul:list-disc prose-ol:list-decimal prose-li:ml-4"
                                  dangerouslySetInnerHTML={{ __html: markdownToHtml(explanation.content) || 'No content available' }}
                                />
                              </div>
                            )}
                            {explanation.sources && explanation.sources.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sources:</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {Array.isArray(explanation.sources) 
                                    ? explanation.sources.join(', ')
                                    : explanation.sources}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                              disabled={currentPage === 1}
                            >
                              <ChevronLeft className="w-4 h-4 mr-1" />
                              Previous
                            </Button>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Showing {startIndex + 1}-{Math.min(endIndex, totalExplanations)} of {totalExplanations}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                              disabled={currentPage === totalPages}
                            >
                              Next
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No AI explanations available for this verse</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                    <p className="text-sm">Click to load AI explanation history</p>
                    <Button
                      className="mt-2"
                      variant="outline"
                      onClick={loadAIExplanationHistory}
                    >
                      <History className="w-4 h-4 mr-2" />
                      Load AI Explanation History
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>

      {/* Edit Explanation Dialog */}
      <Dialog open={!!editingExplanation} onOpenChange={handleCancelEdit}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 w-[95vw] sm:w-full">
          <DialogHeader className="pr-8 sm:pr-6">
            <DialogTitle className="pr-2">Edit Explanation</DialogTitle>
            <DialogDescription>
              Update the explanation content, experience level, and other details.
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
                  placeholder="e.g., theological, historical, cultural"
                />
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
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={editFormData.content}
                  onChange={(e) => setEditFormData({ ...editFormData, content: e.target.value })}
                  placeholder="Enter explanation content..."
                  rows={8}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sources">Sources (comma-separated)</Label>
                <Input
                  id="sources"
                  value={editFormData.sources?.join(', ') || ''}
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
                    'Save Changes'
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

export { VerseDetailModal };
