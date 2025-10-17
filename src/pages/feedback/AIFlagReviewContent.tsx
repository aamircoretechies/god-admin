import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Flag, 
  CheckCircle, 
  XCircle, 
  Edit, 
  AlertTriangle,
  BookOpen,
  User,
  Clock,
  MessageSquare,
  Brain
} from 'lucide-react';

interface FlaggedResponse {
  id: string;
  user: string;
  verse: string;
  originalQuery: string;
  aiResponse: string;
  flagReason: 'Inaccurate' | 'Irrelevant' | 'Offensive';
  flagDetails: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'rejected' | 'edited';
  timestamp: string;
  correctedResponse?: string;
}

const AIFlagReviewContent = () => {
  const [selectedFlag, setSelectedFlag] = useState<string | null>(null);
  const [correctedResponse, setCorrectedResponse] = useState('');

  const flaggedResponses: FlaggedResponse[] = [
    {
      id: '1',
      user: 'John Doe',
      verse: 'John 3:16',
      originalQuery: 'Explain the meaning of this verse',
      aiResponse: 'This verse means that God loves everyone unconditionally and there are no requirements for salvation.',
      flagReason: 'Inaccurate',
      flagDetails: 'The response contradicts the biblical teaching that faith in Jesus is required for salvation.',
      priority: 'high',
      status: 'pending',
      timestamp: '2024-01-20T10:30:00Z'
    },
    {
      id: '2',
      user: 'Sarah Wilson',
      verse: 'Romans 8:28',
      originalQuery: 'What does this verse teach about suffering?',
      aiResponse: 'This verse is about how God causes all things to happen for our benefit, including suffering.',
      flagReason: 'Inaccurate',
      flagDetails: 'Misinterprets the verse - it says God works through all things, not that He causes all things.',
      priority: 'medium',
      status: 'pending',
      timestamp: '2024-01-20T09:15:00Z'
    },
    {
      id: '3',
      user: 'Mike Johnson',
      verse: '1 Corinthians 13:4',
      originalQuery: 'Explain what love is according to this verse',
      aiResponse: 'Love is just being nice to people and not being mean. It\'s basically common sense.',
      flagReason: 'Offensive',
      flagDetails: 'Oversimplifies and trivializes the profound biblical concept of love.',
      priority: 'high',
      status: 'pending',
      timestamp: '2024-01-20T08:45:00Z'
    }
  ];

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive" className="bg-red-100 text-red-800">High Priority</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Medium Priority</Badge>;
      case 'low':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Low Priority</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getReasonBadge = (reason: string) => {
    switch (reason) {
      case 'Inaccurate':
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Inaccurate</Badge>;
      case 'Offensive':
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Offensive</Badge>;
      case 'Irrelevant':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Irrelevant</Badge>;
      default:
        return <Badge variant="outline">{reason}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="default" className="bg-orange-100 text-orange-800">Pending Review</Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'edited':
        return <Badge variant="secondary" className="bg-amber-100 text-amber-800">Edited</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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

  const handleApprove = (id: string) => {
    console.log('Approving flag:', id);
    // Add approval logic here
  };

  const handleReject = (id: string) => {
    console.log('Rejecting flag:', id);
    // Add rejection logic here
  };

  const handleEdit = (id: string) => {
    console.log('Editing response for flag:', id);
    // Add edit logic here
  };

  const handleSaveCorrection = (id: string) => {
    console.log('Saving correction for flag:', id, correctedResponse);
    // Add save correction logic here
    setCorrectedResponse('');
    setSelectedFlag(null);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Flags</p>
                <p className="text-2xl font-bold">23</p>
              </div>
              <Flag className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Flagged Responses */}
      <div className="space-y-4">
        {flaggedResponses.map((flag) => (
          <Card key={flag.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Flag className="w-5 h-5 text-red-500" />
                  <div>
                    <CardTitle className="text-lg">{flag.verse}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{flag.user}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-500">{formatDate(flag.timestamp)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getPriorityBadge(flag.priority)}
                  {getReasonBadge(flag.flagReason)}
                  {getStatusBadge(flag.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Original Query */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Original Query:</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{flag.originalQuery}</p>
                </div>

                {/* AI Response */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">AI Response:</h4>
                  <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                    <p className="text-gray-700">{flag.aiResponse}</p>
                  </div>
                </div>

                {/* Flag Details */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Flag Details:</h4>
                  <p className="text-gray-700 bg-yellow-50 p-3 rounded-lg">{flag.flagDetails}</p>
                </div>

                {/* Corrected Response (if editing) */}
                {selectedFlag === flag.id && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Corrected Response:</h4>
                    <Textarea
                      value={correctedResponse}
                      onChange={(e) => setCorrectedResponse(e.target.value)}
                      placeholder="Enter the corrected AI response..."
                      className="min-h-24"
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleApprove(flag.id)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve Response
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReject(flag.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject Flag
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled
                      title="Response editing not available in Phase 1"
                      className="text-gray-400"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit Response (Phase 2)
                    </Button>
                  </div>
                  
                  {selectedFlag === flag.id && (
                    <Button
                      onClick={() => handleSaveCorrection(flag.id)}
                      className="bg-amber-600 hover:bg-amber-700"
                    >
                      Save Correction
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {flaggedResponses.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Flag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No flagged responses</h3>
            <p className="text-gray-500">All AI responses have been reviewed and approved.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export { AIFlagReviewContent };
