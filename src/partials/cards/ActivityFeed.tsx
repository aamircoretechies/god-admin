import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  BookOpen, 
  User, 
  Flag,
  RefreshCw,
  Clock,
  Eye,
  Activity
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'ai_query' | 'verse_view' | 'user_registration' | 'content_flag';
  user: string;
  action: string;
  details: string;
  timestamp: string;
  status?: 'new' | 'reviewed' | 'resolved';
}

const ActivityFeed = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: '1',
      type: 'ai_query',
      user: 'John Doe',
      action: 'asked AI explanation for',
      details: 'John 3:16 - "For God so loved the world..."',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      status: 'new'
    },
    {
      id: '2',
      type: 'verse_view',
      user: 'Sarah Wilson',
      action: 'viewed verse',
      details: 'Psalm 23:1 - "The Lord is my shepherd..."',
      timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      type: 'content_flag',
      user: 'Mike Johnson',
      action: 'flagged AI response for',
      details: 'Inaccurate theological content in Romans 8:28 explanation',
      timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      status: 'new'
    },
    {
      id: '4',
      type: 'user_registration',
      user: 'New User',
      action: 'registered for',
      details: 'Premium subscription',
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString()
    },
    {
      id: '5',
      type: 'ai_query',
      user: 'Emily Chen',
      action: 'requested explanation for',
      details: 'Matthew 5:14 - "You are the light of the world..."',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
    }
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'ai_query':
        return <MessageSquare className="w-4 h-4 text-amber-500" />;
      case 'verse_view':
        return <BookOpen className="w-4 h-4 text-green-500" />;
      case 'user_registration':
        return <User className="w-4 h-4 text-purple-500" />;
      case 'content_flag':
        return <Flag className="w-4 h-4 text-red-500" />;
      default:
        return <Eye className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActivityBadge = (type: string) => {
    switch (type) {
      case 'ai_query':
        return <Badge variant="secondary" className="bg-amber-100 text-amber-800">AI Query</Badge>;
      case 'verse_view':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Verse View</Badge>;
      case 'user_registration':
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800">Registration</Badge>;
      case 'content_flag':
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Flagged</Badge>;
      default:
        return <Badge variant="outline">Activity</Badge>;
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    switch (status) {
      case 'new':
        return <Badge variant="default" className="bg-orange-100 text-orange-800">New</Badge>;
      case 'reviewed':
        return <Badge variant="secondary" className="bg-amber-100 text-amber-800">Reviewed</Badge>;
      case 'resolved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Resolved</Badge>;
      default:
        return null;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const refreshActivities = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Activity Feed
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshActivities}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50">
              <div className="flex-shrink-0 mt-1">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{activity.user}</span>
                  <span className="text-sm text-gray-600">{activity.action}</span>
                  {getActivityBadge(activity.type)}
                  {getStatusBadge(activity.status)}
                </div>
                <p className="text-sm text-gray-700 mb-2">{activity.details}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  {formatTimeAgo(activity.timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="text-sm text-gray-600">
            <strong>Live Updates:</strong> Activity feed updates every 30 seconds
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { ActivityFeed };
