import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  MessageSquare, 
  Flag, 
  CheckCircle, 
  XCircle,
  Clock,
  User,
  BookOpen,
  AlertTriangle
} from 'lucide-react';

interface FeedbackItem {
  id: string;
  type: 'Content' | 'Audio' | 'Other';
  user: string;
  verse: string;
  comment: string;
  status: 'unresolved' | 'resolved';
  timestamp: string;
  aiResponse?: string;
}

const FeedbackInboxContent = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const feedbackData: FeedbackItem[] = [
    {
      id: '1',
      type: 'Content',
      user: 'John Doe',
      verse: 'John 3:16',
      comment: 'The AI explanation seems to contradict traditional theology',
      status: 'unresolved',
      timestamp: '2024-01-20T10:30:00Z',
      aiResponse: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.'
    },
    {
      id: '2',
      type: 'Audio',
      user: 'Sarah Wilson',
      verse: 'Psalm 23:1',
      comment: 'Great explanation! Could you add more historical context?',
      status: 'resolved',
      timestamp: '2024-01-20T09:15:00Z'
    },
    {
      id: '3',
      type: 'Content',
      user: 'Mike Johnson',
      verse: 'Romans 8:28',
      comment: 'This response is offensive and inappropriate',
      status: 'unresolved',
      timestamp: '2024-01-20T08:45:00Z',
      aiResponse: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.'
    },
    {
      id: '4',
      type: 'Other',
      user: 'Emily Chen',
      verse: 'Matthew 5:14',
      comment: 'The explanation was helpful but could be more detailed',
      status: 'resolved',
      timestamp: '2024-01-19T16:20:00Z'
    },
    {
      id: '5',
      type: 'Audio',
      user: 'David Brown',
      verse: '1 Corinthians 13:4',
      comment: 'This doesn\'t match what my pastor taught',
      status: 'unresolved',
      timestamp: '2024-01-19T14:30:00Z',
      aiResponse: 'Love is patient, love is kind. It does not envy, it does not boast, it is not proud.'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Content':
        return <BookOpen className="w-4 h-4 text-blue-500" />;
      case 'Audio':
        return <MessageSquare className="w-4 h-4 text-green-500" />;
      case 'Other':
        return <Flag className="w-4 h-4 text-gray-500" />;
      default:
        return <MessageSquare className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'unresolved':
        return <Badge variant="default" className="bg-red-100 text-red-800">Unresolved</Badge>;
      case 'resolved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Resolved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Content':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Content</Badge>;
      case 'Audio':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Audio</Badge>;
      case 'Other':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Other</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredData = feedbackData.filter(item => {
    const matchesFilter = filter === 'all' || item.status === filter;
    const matchesSearch = searchTerm === '' || 
      item.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.verse.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.comment.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Feedback Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search feedback..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="unresolved">Unresolved</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredData.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getTypeIcon(item.type)}
                  <div>
                    <div className="font-medium">{item.user}</div>
                    <div className="text-sm text-gray-500">
                      {formatDate(item.timestamp)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getTypeBadge(item.type)}
                  {getStatusBadge(item.status)}
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">{item.verse}</span>
                </div>
                <p className="text-gray-700 mb-3">{item.comment}</p>
                
                {item.aiResponse && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-gray-600 mb-1">AI Response:</div>
                    <p className="text-sm text-gray-700">{item.aiResponse}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                  <Button variant="outline" size="sm">
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                  <Button variant="outline" size="sm" disabled title="Editing not available in Phase 1">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    Edit (Phase 2)
                  </Button>
                </div>
                <div className="text-sm text-gray-500">
                  <Clock className="w-4 h-4 inline mr-1" />
                  {new Date(item.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredData.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export { FeedbackInboxContent };
