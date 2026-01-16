import React, { useState, useEffect } from 'react';
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
  XCircle,
  AlertCircle
} from 'lucide-react';
import { fetchActivityAnalytics, type ActivityAnalyticsResponse } from '@/services/activityLogsApi';

// Simple chart components (placeholder for actual chart library)
const SimpleBarChart = ({ data, title }: { data: any[]; title: string }) => (
  <div className="space-y-2">
    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</h4>
    <div className="space-y-1">
      {data.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="w-20 text-xs text-gray-500 dark:text-gray-400">
            {item.label || ''}
          </div>
          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-amber-500 h-2 rounded-full min-w-[10px]"
              style={{ width: `${item.percentage}%` }}
            ></div>
          </div>
          <div className="w-12 text-xs font-medium text-gray-900 dark:text-gray-100 text-right">
            {item.value}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SimpleLineChart = ({ data, title }: { data: any[]; title: string }) => {
  // Calculate max value for percentage calculation
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</h4>
      <div className="h-32 flex items-end gap-1 pt-6">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex-1 bg-amber-500 rounded-t relative group"
            style={{ height: `${(item.value / maxValue) * 100}%` }}
          >
            <div className="absolute bottom-full left-0 right-0 text-[10px] font-medium text-gray-900 dark:text-white text-center mb-1">
              {item.value}
            </div>
          </div>
        ))}
      </div>
      {/* <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        {data.map((item, index) => (
          <span key={index}>{item.label}</span>
        ))}
      </div> */}
      <div className="flex text-xs text-gray-500 dark:text-gray-400">
        {data.map((item, index) => (
          <div key={index} className="flex-1 text-center">
            {item.label}
          </div>
        ))}
      </div>

    </div>
  );
};

const ActivityAnalyticsContent: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<ActivityAnalyticsResponse['data'] | null>(
    null
  );
  const [days, setDays] = useState(7);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchActivityAnalytics(days);
        if (response.status === 1 && response.data) {
          setAnalyticsData(response.data);
        } else {
          setError(response.message || 'Failed to load analytics');
        }
      } catch (err: any) {
        console.error('Error loading activity analytics:', err);
        setError(err?.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [days]);

  // Transform API data to component format
  const activityTypeData =
    analyticsData?.activityTypesDistribution.map((item) => {
      const total = analyticsData.activityTypesDistribution.reduce((sum, i) => sum + i.count, 0);
      return {
        label: item.type,
        value: item.count,
        percentage: total > 0 ? Math.round((item.count / total) * 100) : 0
      };
    }) || [];

  // Transform daily active users - need day labels
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const activeUsersData =
    analyticsData?.dailyActiveUsers.map((value, index) => ({
      label: dayLabels[index % 7] || `Day ${index + 1}`,
      value: value
    })) || [];

  // Helper function to check if a verse string is a valid, readable verse reference
  const isValidVerseReference = (verse: string): boolean => {
    if (!verse || typeof verse !== 'string') return false;

    // Check if it's a UUID (contains hyphens and matches UUID pattern)
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
    if (uuidPattern.test(verse.trim())) return false;

    // Check if it contains common Bible book names (case-insensitive)
    const bibleBooks = [
      'genesis', 'exodus', 'leviticus', 'numbers', 'deuteronomy', 'joshua', 'judges', 'ruth',
      'samuel', 'kings', 'chronicles', 'ezra', 'nehemiah', 'esther', 'job', 'psalm', 'psalms',
      'proverbs', 'ecclesiastes', 'song', 'isaiah', 'jeremiah', 'lamentations', 'ezekiel',
      'daniel', 'hosea', 'joel', 'amos', 'obadiah', 'jonah', 'micah', 'nahum', 'habakkuk',
      'zephaniah', 'haggai', 'zechariah', 'malachi', 'matthew', 'mark', 'luke', 'john',
      'acts', 'romans', 'corinthians', 'galatians', 'ephesians', 'philippians', 'colossians',
      'thessalonians', 'timothy', 'titus', 'philemon', 'hebrews', 'james', 'peter', 'jude',
      'revelation'
    ];

    const verseLower = verse.toLowerCase();
    const containsBookName = bibleBooks.some(book => verseLower.includes(book));

    // Valid if it contains a book name or looks like a proper verse reference (has numbers and text)
    return containsBookName || (verse.length > 3 && /[a-zA-Z]/.test(verse) && /[0-9]/.test(verse));
  };

  // Transform top verses - only show valid verse references
  const topVersesData =
    analyticsData?.topVerses
      .map((item) => {
        const total = analyticsData.topVerses.reduce((sum, i) => sum + i.count, 0);
        const isValid = isValidVerseReference(item.verse);
        return {
          label: isValid ? item.verse : null,
          value: item.count,
          percentage: total > 0 ? Math.round((item.count / total) * 100) : 0
        };
      })
      .filter((item) => item.label !== null) || [];

  // Transform error rate trend
  const errorRateData =
    analyticsData?.errorRateTrend.map((value, index) => ({
      label: dayLabels[index % 7] || `Day ${index + 1}`,
      value: value
    })) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="spinner-border spinner-border-sm text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !analyticsData) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">{error || 'Failed to load analytics'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Activity Analytics</h2>
          <p className="text-sm text-gray-600">
            {analyticsData.period.startDate && analyticsData.period.endDate && (
              <>
                {new Date(analyticsData.period.startDate).toLocaleDateString()} -{' '}
                {new Date(analyticsData.period.endDate).toLocaleDateString()}
              </>
            )}
          </p>
        </div>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

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
              <p className="text-2xl font-bold">
                {analyticsData.metrics.activeUsers.value.toLocaleString()}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {analyticsData.metrics.activeUsers.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span
                  className={`text-sm ${analyticsData.metrics.activeUsers.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}
                >
                  {analyticsData.metrics.activeUsers.growth > 0 ? '+' : ''}
                  {analyticsData.metrics.activeUsers.growth.toFixed(1)}%
                </span>
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
              <p className="text-2xl font-bold">
                {analyticsData.metrics.totalActivities.value.toLocaleString()}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {analyticsData.metrics.totalActivities.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span
                  className={`text-sm ${analyticsData.metrics.totalActivities.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}
                >
                  {analyticsData.metrics.totalActivities.growth > 0 ? '+' : ''}
                  {analyticsData.metrics.totalActivities.growth.toFixed(1)}%
                </span>
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
              <p className="text-2xl font-bold">
                {analyticsData.metrics.successRate.value.toFixed(1)}%
              </p>
              <div className="flex items-center gap-1 mt-1">
                {analyticsData.metrics.successRate.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span
                  className={`text-sm ${analyticsData.metrics.successRate.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}
                >
                  {analyticsData.metrics.successRate.growth > 0 ? '+' : ''}
                  {analyticsData.metrics.successRate.growth.toFixed(1)}%
                </span>
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
              <p className="text-2xl font-bold">
                {analyticsData.metrics.errorRate.value.toFixed(1)}%
              </p>
              <div className="flex items-center gap-1 mt-1">
                {analyticsData.metrics.errorRate.trend === 'down' ? (
                  <TrendingDown className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingUp className="w-4 h-4 text-red-600" />
                )}
                <span
                  className={`text-sm ${analyticsData.metrics.errorRate.trend === 'down' ? 'text-green-600' : 'text-red-600'}`}
                >
                  {analyticsData.metrics.errorRate.growth > 0 ? '+' : ''}
                  {analyticsData.metrics.errorRate.growth.toFixed(1)}%
                </span>
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
                {analyticsData.metrics.activeUsers.trend === 'up' && (
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Active Users {analyticsData.metrics.activeUsers.growth > 0 ? 'Up' : 'Down'}{' '}
                        {Math.abs(analyticsData.metrics.activeUsers.growth).toFixed(1)}%
                      </p>
                      <p className="text-xs text-gray-600">
                        {analyticsData.metrics.activeUsers.value.toLocaleString()} active users in
                        the last {days} days
                      </p>
                    </div>
                  </div>
                )}
                {analyticsData.metrics.successRate.trend === 'up' && (
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Success Rate Improved</p>
                      <p className="text-xs text-gray-600">
                        {analyticsData.metrics.successRate.value.toFixed(1)}% success rate,{' '}
                        {analyticsData.metrics.successRate.growth > 0 ? '+' : ''}
                        {analyticsData.metrics.successRate.growth.toFixed(1)}% from previous period
                      </p>
                    </div>
                  </div>
                )}
                {analyticsData.metrics.errorRate.trend === 'down' && (
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Error Rate Decreasing</p>
                      <p className="text-xs text-gray-600">
                        Error rate at {analyticsData.metrics.errorRate.value.toFixed(1)}%, down{' '}
                        {Math.abs(analyticsData.metrics.errorRate.growth).toFixed(1)}% from previous
                        period
                      </p>
                    </div>
                  </div>
                )}
                {analyticsData.metrics.totalActivities.trend === 'up' && (
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Total Activities Increased
                      </p>
                      <p className="text-xs text-gray-600">
                        {analyticsData.metrics.totalActivities.value.toLocaleString()} total
                        activities, up {analyticsData.metrics.totalActivities.growth.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Areas for Attention</h4>
              <div className="space-y-3">
                {analyticsData.metrics.activeUsers.trend === 'down' && (
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Active Users Declining</p>
                      <p className="text-xs text-gray-600">
                        Active users decreased by{' '}
                        {Math.abs(analyticsData.metrics.activeUsers.growth).toFixed(1)}% from
                        previous period
                      </p>
                    </div>
                  </div>
                )}
                {analyticsData.metrics.errorRate.value > 0 && (
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Error Rate Present</p>
                      <p className="text-xs text-gray-600">
                        {analyticsData.metrics.errorRate.value.toFixed(1)}% error rate detected in
                        activities
                      </p>
                    </div>
                  </div>
                )}
                {analyticsData.metrics.totalActivities.trend === 'down' && (
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Activity Volume Decreasing
                      </p>
                      <p className="text-xs text-gray-600">
                        Total activities decreased by{' '}
                        {Math.abs(analyticsData.metrics.totalActivities.growth).toFixed(1)}% from
                        previous period
                      </p>
                    </div>
                  </div>
                )}
                {analyticsData.metrics.successRate.trend === 'down' && (
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Success Rate Declining</p>
                      <p className="text-xs text-gray-600">
                        Success rate decreased by{' '}
                        {Math.abs(analyticsData.metrics.successRate.growth).toFixed(1)}% from
                        previous period
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Device Usage Breakdown */}
      {analyticsData.deviceBreakdown && analyticsData.deviceBreakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Device Usage Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analyticsData.deviceBreakdown.map((device, index) => {
                // Group devices by category
                const isMobile = device.device.includes('Mobile');
                const isTablet = device.device.includes('Tablet');
                const isWeb = device.device.includes('Web');

                let bgColor = 'bg-gray-50';
                let textColor = 'text-gray-600';
                if (isMobile) {
                  bgColor = 'bg-amber-50';
                  textColor = 'text-amber-600';
                } else if (isTablet) {
                  bgColor = 'bg-purple-50';
                  textColor = 'text-purple-600';
                } else if (isWeb) {
                  bgColor = 'bg-green-50';
                  textColor = 'text-green-600';
                }

                return (
                  <div key={index} className={`text-center p-4 ${bgColor} rounded-lg`}>
                    <div className={`text-2xl font-bold ${textColor}`}>{device.percentage}%</div>
                    <div className="text-sm text-gray-600">{device.device}</div>
                    <div className="text-xs text-gray-500">
                      {device.count.toLocaleString()} activities
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export { ActivityAnalyticsContent };
