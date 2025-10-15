import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { 
  User, 
  Mail, 
  Calendar,
  MapPin,
  Shield,
  AlertTriangle,
  UserX,
  Smartphone,
  Monitor,
  Tablet,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  TrendingUp,
  BookOpen,
  MessageSquare,
  Bookmark,
  Share,
  LogIn,
  LogOut
} from 'lucide-react';

interface UserActivity {
  id: string;
  activityType: 'Verse Read' | 'AI Query' | 'Bookmark' | 'Share' | 'Feedback Submitted' | 'Login' | 'Logout' | 'Password Change' | 'Profile Update';
  details: string;
  bookReference?: string;
  chapterReference?: string;
  verseReference?: string;
  queryText?: string;
  device: 'Mobile iOS' | 'Mobile Android' | 'Web Desktop' | 'Web Mobile' | 'Tablet';
  platform: string;
  ipAddress: string;
  timestamp: string;
  status: 'Success' | 'Error' | 'Warning';
  errorMessage?: string;
  sessionId: string;
  location?: string;
}

const UserActivityDetailContent: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7days');

  // Mock user data
  const userData = {
    id: 'user1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: '/media/avatars/300-1.png',
    role: 'Premium',
    joinDate: '2023-06-15',
    lastActive: '2024-01-21T14:30:00Z',
    totalActivities: 1247,
    location: 'New York, US',
    status: 'Active'
  };

  // Mock activity timeline
  const userActivities: UserActivity[] = [
    {
      id: '1',
      activityType: 'Verse Read',
      details: 'Read John 3:16',
      bookReference: 'John',
      chapterReference: '3',
      verseReference: '16',
      device: 'Mobile iOS',
      platform: 'iOS 17.2',
      ipAddress: '192.168.1.100',
      timestamp: '2024-01-21T14:30:00Z',
      status: 'Success',
      sessionId: 'sess_123456',
      location: 'New York, US'
    },
    {
      id: '2',
      activityType: 'AI Query',
      details: 'Asked about the meaning of love in 1 Corinthians 13',
      queryText: 'What does 1 Corinthians 13 say about love?',
      device: 'Mobile iOS',
      platform: 'iOS 17.2',
      ipAddress: '192.168.1.100',
      timestamp: '2024-01-21T14:25:00Z',
      status: 'Success',
      sessionId: 'sess_123456',
      location: 'New York, US'
    },
    {
      id: '3',
      activityType: 'Bookmark',
      details: 'Bookmarked Psalm 23',
      bookReference: 'Psalms',
      chapterReference: '23',
      device: 'Mobile iOS',
      platform: 'iOS 17.2',
      ipAddress: '192.168.1.100',
      timestamp: '2024-01-21T14:20:00Z',
      status: 'Success',
      sessionId: 'sess_123456',
      location: 'New York, US'
    },
    {
      id: '4',
      activityType: 'Login',
      details: 'Successful login',
      device: 'Mobile iOS',
      platform: 'iOS 17.2',
      ipAddress: '192.168.1.100',
      timestamp: '2024-01-21T14:15:00Z',
      status: 'Success',
      sessionId: 'sess_123456',
      location: 'New York, US'
    },
    {
      id: '5',
      activityType: 'AI Query',
      details: 'Failed AI query due to rate limit',
      queryText: 'Explain the book of Revelation',
      device: 'Web Desktop',
      platform: 'Chrome 120.0',
      ipAddress: '192.168.1.101',
      timestamp: '2024-01-21T10:30:00Z',
      status: 'Error',
      errorMessage: 'Rate limit exceeded. Please try again in 1 minute.',
      sessionId: 'sess_123457',
      location: 'New York, US'
    },
    {
      id: '6',
      activityType: 'Share',
      details: 'Shared John 3:16 on social media',
      bookReference: 'John',
      chapterReference: '3',
      verseReference: '16',
      device: 'Web Desktop',
      platform: 'Chrome 120.0',
      ipAddress: '192.168.1.101',
      timestamp: '2024-01-21T09:45:00Z',
      status: 'Success',
      sessionId: 'sess_123457',
      location: 'New York, US'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'Verse Read':
        return <BookOpen className="w-4 h-4" />;
      case 'AI Query':
        return <MessageSquare className="w-4 h-4" />;
      case 'Bookmark':
        return <Bookmark className="w-4 h-4" />;
      case 'Share':
        return <Share className="w-4 h-4" />;
      case 'Login':
        return <LogIn className="w-4 h-4" />;
      case 'Logout':
        return <LogOut className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityTypeBadge = (type: string) => {
    const colors = {
      'Verse Read': 'bg-blue-100 text-blue-800',
      'AI Query': 'bg-purple-100 text-purple-800',
      'Bookmark': 'bg-green-100 text-green-800',
      'Share': 'bg-orange-100 text-orange-800',
      'Feedback Submitted': 'bg-pink-100 text-pink-800',
      'Login': 'bg-gray-100 text-gray-800',
      'Logout': 'bg-gray-100 text-gray-800',
      'Password Change': 'bg-red-100 text-red-800',
      'Profile Update': 'bg-indigo-100 text-indigo-800'
    };
    
    return (
      <Badge variant="default" className={colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {type}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Success':
        return <Badge variant="default" className="bg-green-100 text-green-800">Success</Badge>;
      case 'Error':
        return <Badge variant="destructive">Error</Badge>;
      case 'Warning':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'Mobile iOS':
      case 'Mobile Android':
        return <Smartphone className="w-4 h-4" />;
      case 'Web Desktop':
      case 'Web Mobile':
        return <Monitor className="w-4 h-4" />;
      case 'Tablet':
        return <Tablet className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Free':
        return <Badge variant="secondary">Free</Badge>;
      case 'Premium':
        return <Badge variant="default" className="bg-purple-100 text-purple-800">Premium</Badge>;
      case 'Admin':
        return <Badge variant="destructive">Admin</Badge>;
      case 'Moderator':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Moderator</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* User Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <Avatar className="w-20 h-20">
              <img src={userData.avatar} alt={userData.name} />
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{userData.name}</h2>
                {getRoleBadge(userData.role)}
                <Badge variant={userData.status === 'Active' ? 'default' : 'secondary'}>
                  {userData.status}
                </Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{userData.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Joined {new Date(userData.joinDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{userData.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{userData.totalActivities} activities</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm">
                <Shield className="w-4 h-4 mr-2" />
                Reset Role
              </Button>
              <Button variant="outline" size="sm" className="text-orange-600">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Flag User
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Verse Reads</p>
                <p className="text-xl font-bold">847</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MessageSquare className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">AI Queries</p>
                <p className="text-xl font-bold">234</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Bookmark className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Bookmarks</p>
                <p className="text-xl font-bold">156</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Sessions</p>
                <p className="text-xl font-bold">89</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Activity Timeline</CardTitle>
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="24hours">Last 24 Hours</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userActivities.map((activity, index) => (
              <div key={activity.id} className="flex gap-4">
                {/* Timeline Line */}
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  {index < userActivities.length - 1 && (
                    <div className="w-0.5 h-16 bg-gray-200 mt-2"></div>
                  )}
                </div>
                
                {/* Activity Content */}
                <div className="flex-1 bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getActivityIcon(activity.activityType)}
                      {getActivityTypeBadge(activity.activityType)}
                      {getStatusBadge(activity.status)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      {getDeviceIcon(activity.device)}
                      <span>{activity.device}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm font-medium text-gray-900 mb-2">{activity.details}</p>
                  
                  {activity.queryText && (
                    <p className="text-sm text-gray-600 mb-2 italic">"{activity.queryText}"</p>
                  )}
                  
                  {activity.bookReference && (
                    <p className="text-sm text-blue-600 mb-2">
                      {activity.bookReference} {activity.chapterReference}:{activity.verseReference}
                    </p>
                  )}
                  
                  {activity.errorMessage && (
                    <p className="text-sm text-red-600 mb-2">{activity.errorMessage}</p>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-4">
                      <span>{formatDate(activity.timestamp)}</span>
                      <span>{activity.location}</span>
                      <span>IP: {activity.ipAddress}</span>
                    </div>
                    <span>Session: {activity.sessionId}</span>
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

export { UserActivityDetailContent };
