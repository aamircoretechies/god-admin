import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Textarea 
} from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  Edit, 
  Download, 
  Flag, 
  Trash2, 
  Check, 
  X, 
  User, 
  Calendar,
  Tag,
  BookOpen,
  Volume2,
  Paperclip,
  FileText,
  BarChart3,
  Smartphone,
  Monitor,
  Star
} from 'lucide-react';

// Types
interface Note {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  title: string;
  content: string;
  linkedVerses: string[];
  tags: string[];
  status: 'active' | 'flagged' | 'deleted';
  createdAt: string;
  updatedAt: string;
  hasAudio: boolean;
  hasAttachments: boolean;
  isFavorite: boolean;
  language: string;
  wordCount: number;
  source: 'web' | 'mobile';
  attachments?: Array<{
    id: string;
    name: string;
    type: 'image' | 'document' | 'audio';
    url: string;
    thumbnail?: string;
  }>;
  audioUrl?: string;
}

// Mock data
const mockNote: Note = {
  id: '1',
  userId: 'user1',
  userName: 'John Doe',
  userEmail: 'john@example.com',
  userAvatar: '/media/avatars/300-1.png',
  title: 'Reflection on Psalm 23',
  content: `The Lord is my shepherd, I shall not want. He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul. He guides me along the right paths for his name's sake.

Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.

You prepare a table before me in the presence of my enemies. You anoint my head with oil; my cup overflows. Surely your goodness and love will follow me all the days of my life, and I will dwell in the house of the Lord forever.

This passage has been a source of comfort during difficult times. The imagery of God as a shepherd caring for his sheep resonates deeply with me. I find peace in knowing that God is always present, even in the darkest moments of life.`,
  linkedVerses: ['Psalm 23:1-6'],
  tags: ['Faith', 'Trust', 'Comfort', 'Shepherd', 'Peace'],
  status: 'active',
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
  hasAudio: true,
  hasAttachments: true,
  isFavorite: true,
  language: 'English',
  wordCount: 156,
  source: 'mobile',
  attachments: [
    {
      id: '1',
      name: 'prayer_notes.jpg',
      type: 'image',
      url: '/media/images/600x600/1.jpg',
      thumbnail: '/media/images/600x600/1.jpg'
    },
    {
      id: '2',
      name: 'study_notes.pdf',
      type: 'document',
      url: '/media/file-types/pdf.svg'
    }
  ],
  audioUrl: '/media/audio/psalm23-reflection.mp3'
};

const NoteDetailContent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [note, setNote] = useState<Note>(mockNote);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(note.content);
  const [editedTags, setEditedTags] = useState(note.tags.join(', '));
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
      case 'flagged':
        return <Badge variant="destructive">Flagged</Badge>;
      case 'deleted':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-600">Deleted</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleSave = () => {
    setNote({
      ...note,
      content: editedContent,
      tags: editedTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      updatedAt: new Date().toISOString()
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedContent(note.content);
    setEditedTags(note.tags.join(', '));
    setIsEditing(false);
  };

  const handleStatusChange = (newStatus: 'active' | 'flagged' | 'deleted') => {
    setNote({ ...note, status: newStatus });
  };

  const handleDelete = () => {
    setNote({ ...note, status: 'deleted' });
    setShowDeleteDialog(false);
  };

  const handleExport = (format: 'pdf' | 'csv') => {
    console.log(`Exporting note ${note.id} as ${format}`);
    // Implement export functionality
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/notes-journals">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Overview
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Note Detail</h1>
            <p className="text-gray-600">Review and moderate note #{note.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport('pdf')}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={() => handleExport('csv')}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Note Content */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{note.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    {getStatusBadge(note.status)}
                    {note.isFavorite && <Star className="w-4 h-4 text-yellow-500" />}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <Textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="min-h-[200px]"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={editedTags}
                      onChange={(e) => setEditedTags(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Faith, Trust, Comfort"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSave}>
                      <Check className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {note.content}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Linked Verses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Linked Verses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {note.linkedVerses.map((verse, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {verse}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {note.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Attachments */}
          {note.hasAttachments && note.attachments && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Paperclip className="w-5 h-5" />
                  Attachments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {note.attachments.map((attachment) => (
                    <div key={attachment.id} className="border rounded-lg p-3">
                      {attachment.type === 'image' && attachment.thumbnail && (
                        <img
                          src={attachment.thumbnail}
                          alt={attachment.name}
                          className="w-full h-24 object-cover rounded mb-2"
                        />
                      )}
                      {attachment.type === 'document' && (
                        <div className="w-full h-24 bg-gray-100 rounded mb-2 flex items-center justify-center">
                          <FileText className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <p className="text-sm font-medium truncate">{attachment.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{attachment.type}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Audio */}
          {note.hasAudio && note.audioUrl && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5" />
                  Audio Recording
                </CardTitle>
              </CardHeader>
              <CardContent>
                <audio controls className="w-full">
                  <source src={note.audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* User Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                User Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={note.userAvatar} />
                  <AvatarFallback>{note.userName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{note.userName}</p>
                  <p className="text-sm text-gray-500">{note.userEmail}</p>
                </div>
              </div>
              <Link to={`/network/user-table/saas-users/${note.userId}`}>
                <Button variant="outline" size="sm" className="w-full">
                  View User Profile
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Created:</span>
                <span className="text-sm font-medium">{formatDate(note.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Updated:</span>
                <span className="text-sm font-medium">{formatDate(note.updatedAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Word Count:</span>
                <span className="text-sm font-medium">{note.wordCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Language:</span>
                <span className="text-sm font-medium">{note.language}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Source:</span>
                <span className="text-sm font-medium flex items-center gap-1">
                  {note.source === 'mobile' ? (
                    <Smartphone className="w-4 h-4" />
                  ) : (
                    <Monitor className="w-4 h-4" />
                  )}
                  {note.source}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Moderation Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Moderation Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant={note.status === 'active' ? 'default' : 'outline'}
                className="w-full"
                onClick={() => handleStatusChange('active')}
              >
                <Check className="w-4 h-4 mr-2" />
                Approve
              </Button>
              <Button
                variant={note.status === 'flagged' ? 'destructive' : 'outline'}
                className="w-full"
                onClick={() => handleStatusChange('flagged')}
              >
                <Flag className="w-4 h-4 mr-2" />
                {note.status === 'flagged' ? 'Unflag' : 'Flag'}
              </Button>
              <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Note</DialogTitle>
                  </DialogHeader>
                  <p>Are you sure you want to delete this note? This action cannot be undone.</p>
                  <div className="flex gap-2">
                    <Button variant="destructive" onClick={handleDelete}>
                      Delete
                    </Button>
                    <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export { NoteDetailContent };

