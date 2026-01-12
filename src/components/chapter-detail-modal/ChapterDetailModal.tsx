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
import { BookOpen, Calendar, Edit, Trash2, Loader2, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { VALID_EXPERIENCE_LEVELS } from '@/components/verse-detail-modal/VerseDetailModal';

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

interface ChapterDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapter: {
    book: string;
    chapter: number;
    tabName: string;
    experienceLevel?: string;
  } | null;
}

// Store chapter data in localStorage for persistence (temporary until API is available)
// Key includes experience level to store different content per experience level
const getStorageKey = (book: string, chapter: number, tabName: string, experienceLevel: string) => {
  return `chapter_deep_study_${book}_${chapter}_${tabName}_${experienceLevel}`;
};

const getStoredChapterData = (book: string, chapter: number, tabName: string, experienceLevel: string) => {
  const key = getStorageKey(book, chapter, tabName, experienceLevel);
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
};

const setStoredChapterData = (book: string, chapter: number, tabName: string, experienceLevel: string, data: any) => {
  const key = getStorageKey(book, chapter, tabName, experienceLevel);
  localStorage.setItem(key, JSON.stringify(data));
};

const deleteStoredChapterData = (book: string, chapter: number, tabName: string, experienceLevel: string) => {
  const key = getStorageKey(book, chapter, tabName, experienceLevel);
  localStorage.removeItem(key);
};

// Static dummy data for each tab per experience level (fallback)
const getDefaultTabContent = (tabName: string, experienceLevel: string) => {
  // Base content that varies by experience level
  const baseContent: Record<string, Record<string, string>> = {
    'Explanation': {
      'NEW_TO_BIBLE': 'This chapter provides a simple, easy-to-understand explanation perfect for those new to Bible study. It breaks down the main themes and spiritual insights in clear, accessible language.',
      'SOME_KNOWLEDGE': 'This chapter offers a more detailed explanation that builds on basic Bible knowledge. It explores theological themes and spiritual insights with additional context and background.',
      'REGULAR_READER': 'This chapter provides a comprehensive explanation for regular Bible readers. It delves deeper into theological themes, spiritual insights, and connects with broader biblical narratives.',
      'ADVANCED_STUDENT': 'This chapter offers an advanced theological explanation that examines complex themes, original language nuances, and scholarly interpretations for serious Bible students.',
      'SCHOLAR': 'This chapter provides a scholarly, academic-level explanation with detailed analysis of original languages, historical-critical methods, and advanced theological perspectives.'
    },
    'Original': {
      'NEW_TO_BIBLE': 'A simple introduction to the original language of this chapter, explaining basic terms and concepts in easy-to-understand language.',
      'SOME_KNOWLEDGE': 'An overview of the original Hebrew or Greek text with key terms and their meanings explained in context.',
      'REGULAR_READER': 'A detailed analysis of the original text, examining important words, grammatical structures, and linguistic nuances.',
      'ADVANCED_STUDENT': 'An in-depth examination of the original language, including word studies, grammatical analysis, and textual variants.',
      'SCHOLAR': 'A comprehensive scholarly analysis of the original text, including detailed word studies, grammatical analysis, textual criticism, and manuscript evidence.'
    },
    'Source': {
      'NEW_TO_BIBLE': 'Basic information about where this chapter comes from and why it matters in the Bible.',
      'SOME_KNOWLEDGE': 'Historical sources and references that help understand this chapter, including key manuscripts and translations.',
      'REGULAR_READER': 'Detailed historical sources and references, including ancient manuscripts, scholarly research, and textual traditions.',
      'ADVANCED_STUDENT': 'Comprehensive source analysis including manuscript evidence, textual variants, and scholarly research from various traditions.',
      'SCHOLAR': 'Complete scholarly source documentation including critical editions, manuscript evidence, textual variants, and academic research.'
    },
    'Historical Context': {
      'NEW_TO_BIBLE': 'A simple explanation of when and where this chapter was written, and what was happening in the world at that time.',
      'SOME_KNOWLEDGE': 'The historical background of this chapter, including the time period, cultural setting, and important events.',
      'REGULAR_READER': 'Detailed historical context including the political, social, and cultural environment in which this chapter was written.',
      'ADVANCED_STUDENT': 'Comprehensive historical analysis including archaeological evidence, cultural studies, and historical-critical perspectives.',
      'SCHOLAR': 'Advanced historical-critical analysis including archaeological evidence, cultural anthropology, and detailed historical reconstruction.'
    },
    'Ground Text Analysis': {
      'NEW_TO_BIBLE': 'A simple breakdown of the main words and phrases in this chapter.',
      'SOME_KNOWLEDGE': 'An analysis of key words and phrases, explaining their meanings and how they relate to the chapter.',
      'REGULAR_READER': 'Detailed word-by-word analysis examining meanings, grammatical structures, and how words connect to form the message.',
      'ADVANCED_STUDENT': 'In-depth textual analysis including word studies, grammatical structures, syntax, and rhetorical devices.',
      'SCHOLAR': 'Comprehensive textual-critical analysis including detailed word studies, grammatical analysis, syntax, and advanced linguistic methods.'
    },
    'Special Insights': {
      'NEW_TO_BIBLE': 'Helpful insights that make this chapter easier to understand and apply to your life.',
      'SOME_KNOWLEDGE': 'Unique observations and insights that provide deeper understanding of this chapter\'s meaning and significance.',
      'REGULAR_READER': 'Special insights from biblical scholars and theologians that reveal deeper layers of meaning in this chapter.',
      'ADVANCED_STUDENT': 'Advanced insights including theological connections, intertextual links, and scholarly interpretations.',
      'SCHOLAR': 'Scholarly insights including advanced theological analysis, intertextual studies, and academic interpretations.'
    },
    'Daily Life Application': {
      'NEW_TO_BIBLE': 'Simple, practical ways to apply what this chapter teaches to your everyday life.',
      'SOME_KNOWLEDGE': 'Practical applications of this chapter\'s teachings for modern life situations and challenges.',
      'REGULAR_READER': 'Thoughtful applications connecting this chapter\'s principles to contemporary life, relationships, and decision-making.',
      'ADVANCED_STUDENT': 'Advanced applications exploring how this chapter\'s teachings relate to ethics, theology, and Christian living.',
      'SCHOLAR': 'Scholarly applications examining how this chapter\'s teachings relate to systematic theology, ethics, and Christian practice.'
    },
    'Cross-References': {
      'NEW_TO_BIBLE': 'A few related verses that help explain what this chapter means.',
      'SOME_KNOWLEDGE': 'Related verses and passages that connect with the themes and teachings of this chapter.',
      'REGULAR_READER': 'Comprehensive cross-references showing how this chapter connects with other parts of Scripture.',
      'ADVANCED_STUDENT': 'Detailed cross-references including thematic connections, intertextual links, and canonical relationships.',
      'SCHOLAR': 'Comprehensive cross-references including detailed intertextual analysis, canonical relationships, and scholarly connections.'
    },
    'Commentary Insights': {
      'NEW_TO_BIBLE': 'Simple explanations from Bible teachers that help you understand this chapter better.',
      'SOME_KNOWLEDGE': 'Insights from Bible commentaries that explain the meaning and significance of this chapter.',
      'REGULAR_READER': 'Commentary insights from respected theologians and Bible scholars on this chapter.',
      'ADVANCED_STUDENT': 'Advanced commentary insights from theological scholars, including different interpretive approaches.',
      'SCHOLAR': 'Scholarly commentary insights including critical analysis, various interpretive traditions, and academic perspectives.'
    },
    'Key Takeaways': {
      'NEW_TO_BIBLE': 'The main things to remember from this chapter in simple terms.',
      'SOME_KNOWLEDGE': 'The key points and important lessons from this chapter that you should remember.',
      'REGULAR_READER': 'Essential takeaways including main themes, theological points, and practical lessons from this chapter.',
      'ADVANCED_STUDENT': 'Advanced takeaways including theological themes, interpretive insights, and scholarly observations.',
      'SCHOLAR': 'Scholarly takeaways including advanced theological themes, critical insights, and academic observations.'
    },
    'Reflection Prompts': {
      'NEW_TO_BIBLE': 'Simple questions to help you think about what this chapter means for you.',
      'SOME_KNOWLEDGE': 'Thoughtful questions to help you reflect on the meaning and application of this chapter.',
      'REGULAR_READER': 'Reflection prompts designed to deepen your understanding and personal application of this chapter.',
      'ADVANCED_STUDENT': 'Advanced reflection prompts exploring theological implications and deeper meanings.',
      'SCHOLAR': 'Scholarly reflection prompts examining critical questions, theological implications, and academic considerations.'
    }
  };

  const tabContent = baseContent[tabName];
  if (tabContent && tabContent[experienceLevel]) {
    return tabContent[experienceLevel];
  }
  // Fallback to first available level or default
  if (tabContent) {
    return tabContent[Object.keys(tabContent)[0]] || 'Content for this section is being prepared.';
  }
  return 'Content for this section is being prepared.';
};

interface ChapterData {
  explanation_type: string;
  experience_level: string;
  content: string;
  sources: string[];
}

const ChapterDetailModal: React.FC<ChapterDetailModalProps> = ({ isOpen, onClose, chapter }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editFormData, setEditFormData] = useState<ChapterData | null>(null);
  const [saving, setSaving] = useState(false);
  const [chapterData, setChapterData] = useState<ChapterData | null>(null);

  // Get chapter data (from storage or default)
  const loadChapterData = useCallback(() => {
    if (!chapter) return;
    
    const experienceLevel = chapter.experienceLevel || 'NEW_TO_BIBLE';
    const stored = getStoredChapterData(chapter.book, chapter.chapter, chapter.tabName, experienceLevel);
    if (stored) {
      setChapterData(stored);
    } else {
      // Return default data structure based on experience level
      setChapterData({
        explanation_type: chapter.tabName.toLowerCase().replace(/\s+/g, '_'),
        experience_level: experienceLevel,
        content: getDefaultTabContent(chapter.tabName, experienceLevel),
        sources: []
      });
    }
  }, [chapter]);

  useEffect(() => {
    if (isOpen && chapter) {
      loadChapterData();
      setIsEditing(false);
      setIsDeleting(false);
      setEditFormData(null);
    }
  }, [isOpen, chapter, loadChapterData]);

  if (!chapter || !chapterData) return null;

  const handleEdit = () => {
    setEditFormData({
      explanation_type: chapterData.explanation_type,
      experience_level: chapterData.experience_level,
      content: chapterData.content,
      sources: chapterData.sources || []
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFormData(null);
  };

  const handleSaveEdit = async () => {
    if (!editFormData || !editFormData.content.trim()) {
      toast.error('Content is required');
      return;
    }

    try {
      setSaving(true);
      
      // Save to localStorage (temporary until API is available)
      const experienceLevel = editFormData.experience_level || chapter.experienceLevel || 'NEW_TO_BIBLE';
      setStoredChapterData(chapter.book, chapter.chapter, chapter.tabName, experienceLevel, editFormData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('Chapter deep study content updated successfully');
      setIsEditing(false);
      setEditFormData(null);
      // Reload data to show updated content
      loadChapterData();
    } catch (error: any) {
      console.error('Error updating chapter content:', error);
      toast.error(error?.message || 'Failed to update chapter content');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    // Confirm deletion
    if (!window.confirm('Are you sure you want to delete this chapter deep study content? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(true);
      
      // Delete from localStorage (temporary until API is available)
      const experienceLevel = chapter.experienceLevel || 'NEW_TO_BIBLE';
      deleteStoredChapterData(chapter.book, chapter.chapter, chapter.tabName, experienceLevel);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('Chapter deep study content deleted successfully');
      onClose();
    } catch (error: any) {
      console.error('Error deleting chapter content:', error);
      toast.error(error?.message || 'Failed to delete chapter content');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 w-[95vw] sm:w-full">
        <DialogHeader className="pr-8 sm:pr-6">
          <DialogTitle className="flex items-center gap-2 pr-2">
            <BookOpen className="w-5 h-5" />
            {chapter.book} - Chapter {chapter.chapter} - {chapter.tabName}
            {chapterData.experience_level && (
              <Badge className="bg-blue-100 text-blue-800 dark:bg-sand dark:text-white text-xs ml-2">
                {mapExperienceLevel(chapterData.experience_level)}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

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
                    {chapterData.experience_level ? mapExperienceLevel(chapterData.experience_level) : mapExperienceLevel(chapter.experienceLevel || 'NEW_TO_BIBLE')}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Last Updated:</span>
                  <span className="text-sm">{new Date().toLocaleDateString()}</span>
                </div>
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
                          onClick={() => {}}
                          disabled={isEditing || isDeleting}
                        >
                          <RotateCcw className="w-4 h-4" />
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
                    disabled={isEditing || isDeleting}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDelete}
                    disabled={isEditing || isDeleting}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    {isDeleting ? (
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4 mr-1" />
                    )}
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                <p className="text-gray-900 dark:text-black leading-relaxed whitespace-pre-line">
                  {chapterData.content}
                </p>
                {chapterData.sources && chapterData.sources.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sources:</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {chapterData.sources.join(', ')}
                    </p>
                  </div>
                )}
                {chapterData.experience_level && (
                  <div className="mt-2">
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-sand dark:text-white text-xs">
                      {mapExperienceLevel(chapterData.experience_level)}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={handleCancelEdit}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 w-[95vw] sm:w-full">
          <DialogHeader className="pr-8 sm:pr-6">
            <DialogTitle className="pr-2">Edit Chapter Deep Study</DialogTitle>
            <DialogDescription>
              Update the {chapter.tabName} content, experience level, and other details for {chapter.book} Chapter {chapter.chapter}.
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
                  placeholder="Enter chapter deep study content..."
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

export { ChapterDetailModal };

