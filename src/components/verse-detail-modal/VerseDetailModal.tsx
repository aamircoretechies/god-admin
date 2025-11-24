import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BookOpen, 
  Calendar, 
  History,
  Brain,
  Loader2,
  AlertCircle,
  FileText
} from 'lucide-react';
import { fetchVerseAIExplanationHistory, type VerseAIExplanationHistoryResponse } from '@/services/aiExplanationsApi';

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

const VerseDetailModal: React.FC<VerseDetailModalProps> = ({ isOpen, onClose, verse }) => {
  const [aiExplanationHistory, setAIExplanationHistory] = useState<VerseAIExplanationHistoryResponse['data'] | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && verse?.verseId) {
      loadAIExplanationHistory();
    } else {
      setAIExplanationHistory(null);
      setHistoryError(null);
    }
  }, [isOpen, verse?.verseId]);

  const loadAIExplanationHistory = async () => {
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
                  <Badge variant="secondary">{verse.language}</Badge>
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
                  <Badge variant="secondary" className="ml-2">
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
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {aiExplanationHistory.total_explanations}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">With Content</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {aiExplanationHistory.explanations_with_content}
                        </p>
                      </div>
                    </div>

                    {aiExplanationHistory.explanations && aiExplanationHistory.explanations.length > 0 ? (
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-900 dark:text-white">Explanations</h4>
                        {aiExplanationHistory.explanations.map((explanation, index) => (
                          <div
                            key={explanation.explanation_id || index}
                            className="p-4 border rounded-lg border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {explanation.category || explanation.label || 'General'}
                                </Badge>
                                {explanation.context_type && (
                                  <Badge variant="secondary" className="text-xs">
                                    {explanation.context_type}
                                  </Badge>
                                )}
                                {explanation.has_content ? (
                                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs">
                                    Has Content
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-xs">
                                    No Content
                                  </Badge>
                                )}
                              </div>
                            </div>
                            {explanation.content && (
                              <div className="mt-2">
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                  {explanation.content}
                                </p>
                              </div>
                            )}
                            {explanation.sources && explanation.sources.length > 0 && (
                              <div className="mt-2 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gray-400" />
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  Sources: {explanation.sources.join(', ')}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
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
    </Dialog>
  );
};

export { VerseDetailModal };

