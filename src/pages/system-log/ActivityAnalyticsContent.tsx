import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Activity,
  BookOpen,
  MessageSquare,
  Bookmark,
  Share,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

// Simple chart components (placeholder for actual chart library)
const SimpleBarChart = ({ data, title }: { data: any[], title: string }) => (
  <div className="space-y-2">
    <h4 className="text-sm font-medium text-gray-700">{title}</h4>
    <div className="space-y-1">
      {data.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="w-20 text-xs text-gray-600">{item.label}</div>
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-amber-500 h-2 rounded-full" 
              style={{ width: `${item.percentage}%` }}
            ></div>
          </div>
          <div className="w-12 text-xs text-gray-600">{item.value}</div>
        </div>
      ))}
    </div>
  </div>
);

const SimpleLineChart = ({ data, title }: { data: any[], title: string }) => (
  <div className="space-y-2">
    <h4 className="text-sm font-medium text-gray-700">{title}</h4>
    <div className="h-32 flex items-end gap-1">
      {data.map((item, index) => (
        <div key={index} className="flex-1 bg-amber-500 rounded-t" style={{ height: `${item.value}%` }}>
          <div className="text-xs text-white text-center mt-1">{item.value}</div>
        </div>
      ))}
    </div>
    <div className="flex justify-between text-xs text-gray-500">
      {data.map((item, index) => (
        <span key={index}>{item.label}</span>
      ))}
    </div>
  </div>
);

const ActivityAnalyticsContent: React.FC = () => {
  // Mock analytics data
  const activityTypeData = [
    { label: 'Verse Reads', value: 1247, percentage: 45 },
    { label: 'AI Queries', value: 892, percentage: 32 },
    { label: 'Bookmarks', value: 456, percentage: 16 },
    { label: 'Shares', value: 234, percentage: 8 },
    { label: 'Logins', value: 123, percentage: 4 }
  ];

  const activeUsersData = [
    { label: 'Mon', value: 65 },
    { label: 'Tue', value: 72 },
    { label: 'Wed', value: 68 },
    { label: 'Thu', value: 85 },
    { label: 'Fri', value: 78 },
    { label: 'Sat', value: 90 },
    { label: 'Sun', value: 82 }
  ];

  const topVersesData = [
    { label: 'John 3:16', value: 156, percentage: 25 },
    { label: 'Psalm 23', value: 134, percentage: 21 },
    { label: '1 Cor 13', value: 98, percentage: 16 },
    { label: 'Matthew 6', value: 87, percentage: 14 },
    { label: 'Romans 8', value: 76, percentage: 12 }
  ];

  const errorRateData = [
    { label: 'Mon', value: 12 },
    { label: 'Tue', value: 8 },
    { label: 'Wed', value: 15 },
    { label: 'Thu', value: 6 },
    { label: 'Fri', value: 9 },
    { label: 'Sat', value: 11 },
    { label: 'Sun', value: 7 }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex-shrink-0">
              <div className="p-3 bg-amber-100 rounded-lg">
                <Users className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold">2,847</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">+12.5%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex-shrink-0">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">Total Activities</p>
              <p className="text-2xl font-bold">15,234</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">+8.3%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex-shrink-0">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold">98.7%</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">+0.5%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex-shrink-0">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">Error Rate</p>
              <p className="text-2xl font-bold">1.3%</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingDown className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">-0.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Activity Types Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={activityTypeData} title="Activity Distribution" />
          </CardContent>
        </Card>

        {/* Active Users Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Active Users Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleLineChart data={activeUsersData} title="Daily Active Users" />
          </CardContent>
        </Card>

        {/* Most Engaged Verses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Most Engaged Verses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={topVersesData} title="Top Verses by Engagement" />
          </CardContent>
        </Card>

        {/* Error Rate Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              Error Rate Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleLineChart data={errorRateData} title="Daily Error Rate (%)" />
          </CardContent>
        </Card>
      </div>

      {/* Insights Section */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Positive Trends</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">User Engagement Up 12.5%</p>
                    <p className="text-xs text-gray-600">Active users increased significantly this week</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">AI Query Success Rate Improved</p>
                    <p className="text-xs text-gray-600">98.7% success rate, up from 98.2% last week</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Mobile Usage Growing</p>
                    <p className="text-xs text-gray-600">65% of activities now from mobile devices</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Areas for Attention</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Rate Limit Errors</p>
                    <p className="text-xs text-gray-600">15% of AI query errors due to rate limiting</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Session Drop-offs</p>
                    <p className="text-xs text-gray-600">22% of users don't complete their sessions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Geographic Spikes</p>
                    <p className="text-xs text-gray-600">Unusual activity patterns from certain regions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Device Usage Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Device Usage Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="text-2xl font-bold text-amber-600">65%</div>
              <div className="text-sm text-gray-600">Mobile</div>
              <div className="text-xs text-gray-500">iOS: 38% | Android: 27%</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">28%</div>
              <div className="text-sm text-gray-600">Desktop</div>
              <div className="text-xs text-gray-500">Chrome: 45% | Firefox: 23%</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">7%</div>
              <div className="text-sm text-gray-600">Tablet</div>
              <div className="text-xs text-gray-500">iPad: 82% | Android: 18%</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { ActivityAnalyticsContent };
