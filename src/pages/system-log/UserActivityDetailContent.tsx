import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { toAbsoluteUrl } from '@/utils';
import { fetchUserActivityLogs, type UserActivityLogResponse } from '@/services/activityLogsApi';
import { fetchUserProfile } from '@/services/usersApi';
import { AlertCircle } from 'lucide-react';
import { 
  Mail, 
  Calendar,
  Shield,
  AlertTriangle,
  Smartphone,
  Monitor,
  Tablet,
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
  activityType: string;
  details: string;
  bookReference?: string;
  chapterReference?: string;
  verseReference?: string;
  queryText?: string;
  device: string;
  platform: string;
  ipAddress: string;
  timestamp: string;
  status: 'Success' | 'Error' | 'Warning';
  errorMessage?: string | null;
  sessionId: string;
  location?: string | null;
}

// Transform API response to component format
const transformUserActivity = (apiData: UserActivityLogResponse): UserActivity => {
  // Parse verse reference if available
  let bookReference: string | undefined;
  let chapterReference: string | undefined;
  let verseReference: string | undefined;
  
  if (apiData.verseReference) {
    // Try to parse "John 3:16" or "Romans 8" format
    const match = apiData.verseReference.match(/^(\w+)\s+(\d+):(\d+)$/);
    if (match) {
      bookReference = match[1];
      chapterReference = match[2];
      verseReference = match[3];
    } else {
      const chapterMatch = apiData.verseReference.match(/^(\w+)\s+(\d+)$/);
      if (chapterMatch) {
        bookReference = chapterMatch[1];
        chapterReference = chapterMatch[2];
      } else {
        verseReference = apiData.verseReference;
      }
    }
  }

  return {
    id: apiData.log_id,
    activityType: apiData.activityType,
    details: apiData.details,
    bookReference: bookReference,
    chapterReference: chapterReference,
    verseReference: verseReference || apiData.verseReference || undefined,
    device: apiData.device,
    platform: apiData.device, // Use device as platform
    ipAddress: apiData.ipAddress,
    timestamp: apiData.dateTime,
    status: apiData.status as 'Success' | 'Error' | 'Warning',
    errorMessage: apiData.errorMessage || undefined,
    sessionId: apiData.sessionId,
    location: apiData.location || undefined
  };
};

const UserActivityDetailContent: React.FC = () => {
  const { id: userId } = useParams<{ id: string }>();
  const [selectedTimeRange, setSelectedTimeRange] = useState('7days');
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Map time range to days
  const getDaysFromRange = (range: string): number => {
    switch (range) {
      case '24hours':
        return 1;
      case '7days':
        return 7;
      case '30days':
        return 30;
      case '90days':
        return 90;
      default:
        return 7;
    }
  };

  useEffect(() => {
    if (!userId) {
      setError('User ID is required');
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch user profile and activity logs in parallel
        const [profileResponse, activityResponse] = await Promise.all([
          fetchUserProfile(userId),
          fetchUserActivityLogs(userId, {
            page: 1,
            limit: 50,
            days: getDaysFromRange(selectedTimeRange)
          })
        ]);

        // Set user data
        if (profileResponse.status === 1 && profileResponse.data?.basicUserInfo) {
          const basicInfo = profileResponse.data.basicUserInfo;
          const avatarNumber = (parseInt(basicInfo.userId.replace(/-/g, ''), 16) % 34) + 1;
          
          setUserData({
            id: basicInfo.userId,
            name: basicInfo.fullName,
            email: basicInfo.email,
            avatar: `/media/avatars/300-${avatarNumber}.png`,
            role: basicInfo.accountType,
            joinDate: basicInfo.memberSince,
            status: basicInfo.status === 'active' ? 'Active' : 'Inactive'
          });
        }

        // Set activity logs
        if (activityResponse.status === 1 && activityResponse.data) {
          const transformedActivities = activityResponse.data.map(transformUserActivity);
          setUserActivities(transformedActivities);
        } else {
          setError(activityResponse.message || 'Failed to load activity logs');
        }
      } catch (err: any) {
        console.error('Error loading user activity:', err);
        setError(err?.message || 'Failed to load user activity');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId, selectedTimeRange]);

  // Calculate statistics from activities
  const statistics = React.useMemo(() => {
    const verseReads = userActivities.filter((a) => a.activityType === 'Verse Read').length;
    const aiQueries = userActivities.filter((a) => a.activityType === 'AI Query').length;
    const bookmarks = userActivities.filter((a) => a.activityType === 'Bookmark').length;
    const uniqueSessions = new Set(userActivities.map((a) => a.sessionId)).size;

    return {
      verseReads,
      aiQueries,
      bookmarks,
      sessions: uniqueSessions
    };
  }, [userActivities]);

  const getActivityIcon = (type: string) => {
    const normalizedType = type.toLowerCase();
    if (normalizedType.includes('verse') || normalizedType.includes('read')) {
      return <BookOpen className="w-4 h-4" />;
    } else if (normalizedType.includes('ai') || normalizedType.includes('query')) {
      return <MessageSquare className="w-4 h-4" />;
    } else if (normalizedType.includes('bookmark')) {
      return <Bookmark className="w-4 h-4" />;
    } else if (normalizedType.includes('share')) {
      return <Share className="w-4 h-4" />;
    } else if (normalizedType.includes('login')) {
      return <LogIn className="w-4 h-4" />;
    } else if (normalizedType.includes('logout')) {
      return <LogOut className="w-4 h-4" />;
    } else if (normalizedType.includes('reflection') || normalizedType.includes('note')) {
      return <BookOpen className="w-4 h-4" />;
    }
    return <Activity className="w-4 h-4" />;
  };

  const getActivityTypeBadge = (type: string) => {
    const colors = {
      'Verse Read': 'bg-amber-100 text-amber-800',
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
    if (device.includes('Mobile')) {
      return <Smartphone className="w-4 h-4" />;
    } else if (device.includes('Web')) {
      return <Monitor className="w-4 h-4" />;
    } else if (device.includes('Tablet')) {
      return <Tablet className="w-4 h-4" />;
    }
    return <Monitor className="w-4 h-4" />;
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
    const normalizedRole = role.toUpperCase();
    switch (normalizedRole) {
      case 'FREE':
        return <Badge variant="outline">Free</Badge>;
      case 'PREMIUM':
        return <Badge variant="default" className="bg-purple-100 text-purple-800">Premium</Badge>;
      case 'ADMIN':
        return <Badge variant="destructive">Admin</Badge>;
      case 'MODERATOR':
        return <Badge variant="default" className="bg-amber-100 text-amber-800">Moderator</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="spinner-border spinner-border-sm text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">Loading user activity...</p>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">{error || 'Failed to load user activity'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <Avatar className="w-20 h-20">
              <img src={toAbsoluteUrl(userData.avatar)} alt={userData.name} />
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{userData.name}</h2>
                {getRoleBadge(userData.role)}
                <Badge variant={userData.status === 'Active' ? 'default' : 'outline'}>
                  {userData.status}
                </Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2 -ml-2">
                  {/* <Mail className="w-4 h-4 text-gray-400" /> */}
                  <span className="text-sm text-gray-600">{userData.email}</span>
                </div>
                <div className="flex items-center gap-2 ml-3">
                  <Calendar className="w-4 h-4 text-gray-400 " />
                  <span className="text-sm text-gray-600">Joined {userData.joinDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{userActivities.length} activities</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {userActivities.length > 0 ? formatDate(userActivities[0].timestamp) : 'No recent activity'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {/* <Button variant="outline" size="sm">
                <Shield className="w-4 h-4 mr-2" />
                Reset Role
              </Button>
              <Button variant="outline" size="sm" className="text-orange-600">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Flag User
              </Button> */}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Verse Reads</p>
                <p className="text-xl font-bold">{statistics.verseReads}</p>
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
                <p className="text-xl font-bold">{statistics.aiQueries}</p>
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
                <p className="text-xl font-bold">{statistics.bookmarks}</p>
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
                <p className="text-xl font-bold">{statistics.sessions}</p>
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
              className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-card"
            >
              <option value="24hours">Last 24 Hours</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {userActivities.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500">No activities found for the selected time range.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {userActivities.map((activity, index) => (
              <div key={activity.id} className="flex gap-4">
                {/* Timeline Line */}
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  {index < userActivities.length - 1 && (
                    <div className="w-0.5 h-16 bg-gray-200 mt-2"></div>
                  )}
                </div>
                
                {/* Activity Content */}
                <div className="flex-1 bg-card rounded-lg p-4 ">
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
                  
                  <p className="text-sm font-medium text-gray-900 mb-2 break-all">{activity.details}</p>
                  
                  {activity.queryText && (
                    <p className="text-sm text-gray-600 mb-2 italic">"{activity.queryText}"</p>
                  )}
                  
                  {activity.bookReference && (
                    <p className="text-sm text-amber-600 mb-2">
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export { UserActivityDetailContent };
