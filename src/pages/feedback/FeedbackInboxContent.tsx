import React, { useState, useEffect, useMemo } from 'react';
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
  MessageSquare, 
  Flag, 
  CheckCircle, 
  XCircle,
  Clock,
  User,
  BookOpen,
  AlertTriangle,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { 
  fetchFlaggedContent, 
  approveFeedback, 
  rejectFeedback,
  type FlaggedContentResponse 
} from '@/services/flaggedContentApi';
import { toast } from 'sonner';

interface FeedbackItem {
  id: string;
  type: 'Content' | 'Audio' | 'Other';
  user: string;
  verse: string;
  comment: string;
  status: 'unresolved' | 'resolved' | 'pending';
  timestamp: string;
  aiResponse?: string;
  tags?: string[];
  reporter?: {
    email: string;
    full_name: string;
    role: string;
  };
}

// Transform API response to component format
const transformFlaggedContent = (apiData: FlaggedContentResponse): FeedbackItem => {
  // Map status: PENDING -> pending, others -> resolved/unresolved
  const mapStatus = (status: string): 'unresolved' | 'resolved' | 'pending' => {
    if (status === 'PENDING') return 'pending';
    if (status === 'RESOLVED' || status === 'APPROVED') return 'resolved';
    return 'unresolved';
  };

  // Map content_type to type
  const mapType = (contentType: string): 'Content' | 'Audio' | 'Other' => {
    if (contentType === 'verse' || contentType === 'explanation') return 'Content';
    if (contentType === 'audio') return 'Audio';
    return 'Other';
  };

  // Format verse reference
  const verseRef = `${apiData.book} ${apiData.chapter}:${apiData.verse} (${apiData.version})`;

  return {
    id: apiData.report_id,
    type: mapType(apiData.content_type),
    user: apiData.reporter?.full_name || apiData.reporter?.email || 'Unknown User',
    verse: verseRef,
    comment: apiData.description || apiData.reason,
    status: mapStatus(apiData.status),
    timestamp: apiData.created_at,
    tags: apiData.tags,
    reporter: apiData.reporter
  };
};

const FeedbackInboxContent = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedbackData, setFeedbackData] = useState<FeedbackItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  // Fetch flagged content from API
  useEffect(() => {
    const loadFlaggedContent = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchFlaggedContent({
          page: currentPage,
          limit: pageSize,
          // status: filter !== 'all' ? filter.toUpperCase() : undefined,
          status: filter === "unresolved" ? "REJECTED" : filter !== "all" ? filter.toUpperCase() : undefined,

          search: searchTerm || undefined
        });

        if (response.status === 1 && response.data) {
          const transformed = response.data.map(transformFlaggedContent);
          setFeedbackData(transformed);
          setTotalCount(response.metadata.total);
          setTotalPages(response.metadata.totalPages);
        } else {
          throw new Error(response.message || 'Failed to fetch flagged content');
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to load flagged content');
        setFeedbackData([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      loadFlaggedContent();
    }, searchTerm ? 500 : 0);

    return () => clearTimeout(debounceTimer);
  }, [currentPage, filter, searchTerm]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm]);

  // Handle approve feedback
  const handleApprove = async (id: string) => {
    try {
      const response = await approveFeedback(id, {});
      if (response.status === 1) {
        toast.success(response.message || 'Feedback approved successfully');
        // Refresh the list
        const updatedResponse = await fetchFlaggedContent({
          page: currentPage,
          limit: pageSize,
          // status: filter !== 'all' ? filter.toUpperCase() : undefined,
          status: filter === "unresolved" ? "REJECTED" : filter !== "all" ? filter.toUpperCase() : undefined,

          search: searchTerm || undefined
        });
        if (updatedResponse.status === 1 && updatedResponse.data) {
          const transformed = updatedResponse.data.map(transformFlaggedContent);
          setFeedbackData(transformed);
          setTotalCount(updatedResponse.metadata.total);
          setTotalPages(updatedResponse.metadata.totalPages);
        }
      } else {
        throw new Error(response.message || 'Failed to approve feedback');
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to approve feedback';
      toast.error(errorMessage);
    }
  };

  // Handle reject feedback
  const handleReject = async (id: string) => {
    try {
      const response = await rejectFeedback(id, {
        rejection_reason: 'Rejected by admin'
      });
      if (response.status === 1) {
        toast.success(response.message || 'Feedback rejected successfully');
        // Refresh the list
        const updatedResponse = await fetchFlaggedContent({
          page: currentPage,
          limit: pageSize,
          // status: filter !== 'all' ? filter.toUpperCase() : undefined,
          status: filter === "unresolved" ? "REJECTED" : filter !== "all" ? filter.toUpperCase() : undefined,

          search: searchTerm || undefined
        });
        if (updatedResponse.status === 1 && updatedResponse.data) {
          const transformed = updatedResponse.data.map(transformFlaggedContent);
          setFeedbackData(transformed);
          setTotalCount(updatedResponse.metadata.total);
          setTotalPages(updatedResponse.metadata.totalPages);
        }
      } else {
        throw new Error(response.message || 'Failed to reject feedback');
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to reject feedback';
      toast.error(errorMessage);
    }
  };

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
      case 'pending':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
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

  // Client-side filtering as fallback (API should handle it)
  const filteredData = useMemo(() => {
    return feedbackData.filter(item => {
    const matchesFilter = filter === 'all' || item.status === filter;
    const matchesSearch = searchTerm === '' || 
      item.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.verse.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.comment.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  }, [feedbackData, filter, searchTerm]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading flagged content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Feedback</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

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
                <SelectItem value="pending">Pending</SelectItem>
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
                <p className="text-gray-700 mb-3 break-all">{item.comment}</p>
                
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {item.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {item.reporter && (
                  <div className="text-sm text-gray-600 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    {item.reporter.email} ({item.reporter.role})
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleApprove(item.id)}
                    disabled={item.status === 'resolved'}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleReject(item.id)}
                    disabled={item.status === 'resolved'}
                  >
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
            <p className="text-gray-500">
              {searchTerm || filter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'No flagged content available at the moment.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing page {currentPage} of {totalPages} ({totalCount} total items)
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export { FeedbackInboxContent };
