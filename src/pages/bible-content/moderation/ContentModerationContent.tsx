import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Clock,
  Eye,
  Edit,
  MessageSquare,
  Search,
  Filter,
  Flag,
  User,
  Calendar,
  FileText
} from 'lucide-react';

interface FlaggedContent {
  id: string;
  type: 'verse' | 'explanation' | 'reflection' | 'translation';
  title: string;
  content: string;
  reason: 'theological_error' | 'inappropriate' | 'inaccurate' | 'spam' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'under_review' | 'resolved' | 'dismissed';
  reportedBy: string;
  reportedAt: string;
  assignedTo?: string;
  reviewedAt?: string;
  reviewerNotes?: string;
  action?: 'edit' | 'delete' | 'approve' | 'flag_for_review';
}

const mockFlaggedContent: FlaggedContent[] = [
  {
    id: '1',
    type: 'explanation',
    title: 'Genesis 1:1 - AI Explanation',
    content: 'This verse establishes the fundamental truth that God is the Creator of all things. The Hebrew word "bara" (created) is used exclusively of God\'s creative activity and implies creation from nothing. This verse sets the foundation for all biblical theology.',
    reason: 'theological_error',
    severity: 'medium',
    status: 'pending',
    reportedBy: 'user123',
    reportedAt: '2024-01-20',
    assignedTo: 'Dr. Smith'
  },
  {
    id: '2',
    type: 'verse',
    title: 'John 3:16 - Translation Issue',
    content: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
    reason: 'inaccurate',
    severity: 'low',
    status: 'under_review',
    reportedBy: 'user456',
    reportedAt: '2024-01-19',
    assignedTo: 'Pastor Johnson',
    reviewerNotes: 'Checking translation accuracy against original manuscripts'
  }
];

const ContentModerationContent = () => {
  const [flaggedContent, setFlaggedContent] = useState<FlaggedContent[]>(mockFlaggedContent);
  const [selectedContent, setSelectedContent] = useState<FlaggedContent | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [reasonFilter, setReasonFilter] = useState<string>('all');
  const [reviewNotes, setReviewNotes] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('');

  const filteredContent = flaggedContent.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || content.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || content.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || content.severity === severityFilter;
    const matchesReason = reasonFilter === 'all' || content.reason === reasonFilter;
    return matchesSearch && matchesType && matchesStatus && matchesSeverity && matchesReason;
  });

  const handleReview = (content: FlaggedContent) => {
    setSelectedContent(content);
    setReviewNotes(content.reviewerNotes || '');
    setSelectedAction(content.action || '');
  };

  const handleSaveReview = () => {
    if (!selectedContent) return;

    const updatedContent = {
      ...selectedContent,
      status: 'resolved' as const,
      reviewedAt: new Date().toISOString().split('T')[0],
      reviewerNotes: reviewNotes,
      action: selectedAction as any
    };

    setFlaggedContent(flaggedContent.map(c => 
      c.id === selectedContent.id ? updatedContent : c
    ));

    setSelectedContent(null);
    setReviewNotes('');
    setSelectedAction('');
  };

  const handleAssign = (contentId: string, assignee: string) => {
    setFlaggedContent(flaggedContent.map(c => 
      c.id === contentId 
        ? { ...c, assignedTo: assignee, status: 'under_review' as const }
        : c
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'dismissed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getReasonColor = (reason: string) => {
    switch (reason) {
      case 'theological_error':
        return 'bg-red-100 text-red-800';
      case 'inappropriate':
        return 'bg-orange-100 text-orange-800';
      case 'inaccurate':
        return 'bg-yellow-100 text-yellow-800';
      case 'spam':
        return 'bg-purple-100 text-purple-800';
      case 'other':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'verse':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'explanation':
        return <MessageSquare className="w-4 h-4 text-purple-600" />;
      case 'reflection':
        return <FileText className="w-4 h-4 text-green-600" />;
      case 'translation':
        return <FileText className="w-4 h-4 text-orange-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Flagged</p>
                <p className="text-2xl font-bold text-gray-900">{flaggedContent.length}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <Flag className="w-6 h-6 text-red-600" />
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
                  {flaggedContent.filter(c => c.status === 'pending').length}
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
                <p className="text-sm font-medium text-gray-600">Under Review</p>
                <p className="text-2xl font-bold text-gray-900">
                  {flaggedContent.filter(c => c.status === 'under_review').length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {flaggedContent.filter(c => c.status === 'resolved').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search flagged content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="verse">Verse</SelectItem>
                  <SelectItem value="explanation">Explanation</SelectItem>
                  <SelectItem value="reflection">Reflection</SelectItem>
                  <SelectItem value="translation">Translation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="dismissed">Dismissed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={reasonFilter} onValueChange={setReasonFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reasons</SelectItem>
                  <SelectItem value="theological_error">Theological Error</SelectItem>
                  <SelectItem value="inappropriate">Inappropriate</SelectItem>
                  <SelectItem value="inaccurate">Inaccurate</SelectItem>
                  <SelectItem value="spam">Spam</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Flagged Content List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            Flagged Content ({filteredContent.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredContent.map((content) => (
              <div key={content.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      {getTypeIcon(content.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{content.title}</h3>
                      <p className="text-sm text-gray-600">Reported by {content.reportedBy}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getSeverityColor(content.severity)}>
                      {content.severity.charAt(0).toUpperCase() + content.severity.slice(1)}
                    </Badge>
                    <Badge className={getReasonColor(content.reason)}>
                      {content.reason.replace('_', ' ').charAt(0).toUpperCase() + content.reason.slice(1).replace('_', ' ')}
                    </Badge>
                    <Badge className={getStatusColor(content.status)}>
                      {content.status.replace('_', ' ').charAt(0).toUpperCase() + content.status.slice(1).replace('_', ' ')}
                    </Badge>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {content.content}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">
                      Assigned: {content.assignedTo || 'Unassigned'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Reported: {content.reportedAt}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">
                      Reviewed: {content.reviewedAt || 'Not reviewed'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">
                      Action: {content.action ? content.action.charAt(0).toUpperCase() + content.action.slice(1) : 'None'}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t">
                  <div className="text-sm text-gray-500">
                    {content.reviewerNotes && (
                      <span>Notes: {content.reviewerNotes.substring(0, 50)}...</span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleReview(content)}>
                      <Eye className="w-4 h-4 mr-1" />
                      Review
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Contact Reporter
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { ContentModerationContent }; 