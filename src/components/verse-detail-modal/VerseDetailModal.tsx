import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BookOpen, 
  Calendar, 
  User, 
  History,
  Brain,
  Eye
} from 'lucide-react';

interface VerseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  verse: {
    id: string;
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
              <div className="bg-gray-50 p-4 rounded-lg">
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
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  View and manage AI-generated explanations for this verse.
                </p>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => {
                    // Navigate to AI explanation history for this verse
                    console.log('Navigate to AI explanation history for verse:', verse.id);
                  }}
                >
                  <History className="w-4 h-4 mr-2" />
                  View AI Explanation History
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                // Navigate to AI explanation history
                console.log('Navigate to AI explanation history');
              }}
            >
              <Eye className="w-4 h-4 mr-2" />
              View AI Explanations
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { VerseDetailModal };

