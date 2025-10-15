import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Crown, 
  DollarSign,
  Calendar,
  Activity,
  PieChart,
  LineChart,
  Target,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

// Mock data for charts
const mockChartData = {
  userGrowth: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    free: [1200, 1350, 1420, 1580, 1650, 1800],
    premium: [150, 180, 220, 280, 320, 380]
  },
  revenue: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [4500, 5200, 6100, 7200, 8400, 9500]
  },
  conversion: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [12.5, 13.3, 15.5, 17.7, 19.4, 21.1]
  },
  churn: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [2.1, 1.9, 2.3, 1.8, 2.0, 1.7]
  }
};

// Simple chart components
const SimpleBarChart: React.FC<{ data: number[], labels: string[], title: string, color: string }> = ({ data, labels, title, color }) => (
  <div className="space-y-2">
    <h4 className="text-sm font-medium text-gray-700">{title}</h4>
    <div className="flex items-end gap-1 h-32">
      {data.map((value, index) => (
        <div key={index} className="flex-1 flex flex-col items-center">
          <div 
            className="rounded-t w-full"
            style={{ 
              height: `${(value / Math.max(...data)) * 100}%`,
              backgroundColor: color
            }}
          />
          <span className="text-xs text-gray-500 mt-1">{labels[index]}</span>
        </div>
      ))}
    </div>
  </div>
);

const SimpleLineChart: React.FC<{ data: number[], labels: string[], title: string, color: string }> = ({ data, labels, title, color }) => (
  <div className="space-y-2">
    <h4 className="text-sm font-medium text-gray-700">{title}</h4>
    <div className="flex items-end gap-1 h-32">
      {data.map((value, index) => (
        <div key={index} className="flex-1 flex flex-col items-center">
          <div 
            className="rounded-t w-full"
            style={{ 
              height: `${(value / Math.max(...data)) * 100}%`,
              backgroundColor: color
            }}
          />
          <span className="text-xs text-gray-500 mt-1">{labels[index]}</span>
        </div>
      ))}
    </div>
  </div>
);

const SubscriptionAnalyticsContent: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>('6months');

  // Mock analytics data
  const analyticsData = {
    totalRevenue: 95400,
    monthlyGrowth: 15.2,
    conversionRate: 21.1,
    churnRate: 1.7,
    avgRevenuePerUser: 25.00,
    totalSubscribers: 382,
    freeUsers: 1847,
    premiumUsers: 382
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-green-100 rounded-lg flex-shrink-0">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${analyticsData.totalRevenue.toLocaleString()}</p>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <ArrowUpRight className="w-3 h-3" />
                +{analyticsData.monthlyGrowth}% from last month
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-purple-100 rounded-lg flex-shrink-0">
              <Crown className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">Premium Users</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.premiumUsers.toLocaleString()}</p>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <ArrowUpRight className="w-3 h-3" />
                +8.5% from last month
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-blue-100 rounded-lg flex-shrink-0">
            <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.conversionRate}%</p>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <ArrowUpRight className="w-3 h-3" />
                +2.1% from last month
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-red-100 rounded-lg flex-shrink-0">
              <Activity className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">Churn Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.churnRate}%</p>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <ArrowDownRight className="w-3 h-3" />
                -0.3% from last month
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Premium vs Free User Growth Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Premium vs Free User Growth
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SimpleBarChart
                data={mockChartData.userGrowth.free}
                labels={mockChartData.userGrowth.labels}
                title="Free Users"
                color="#3B82F6"
              />
              <SimpleBarChart
                data={mockChartData.userGrowth.premium}
                labels={mockChartData.userGrowth.labels}
                title="Premium Users"
                color="#8B5CF6"
              />
            </div>
            
            {/* Growth Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-sm text-gray-600">Free User Growth</p>
                <p className="text-lg font-bold text-blue-600">+50%</p>
                <p className="text-xs text-gray-500">Last 6 months</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Premium User Growth</p>
                <p className="text-lg font-bold text-purple-600">+153%</p>
                <p className="text-xs text-gray-500">Last 6 months</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Conversion Trend</p>
                <p className="text-lg font-bold text-green-600">+68.8%</p>
                <p className="text-xs text-gray-500">Last 6 months</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="w-5 h-5" />
              Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleLineChart
              data={mockChartData.revenue.data}
              labels={mockChartData.revenue.labels}
              title="Monthly Revenue ($)"
              color="#10B981"
            />
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Revenue (6 months)</span>
                <span className="text-sm font-medium">$38,900</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Average Monthly Revenue</span>
                <span className="text-sm font-medium">$6,483</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conversion & Churn */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Conversion & Churn Rates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <SimpleLineChart
                data={mockChartData.conversion.data}
                labels={mockChartData.conversion.labels}
                title="Conversion Rate (%)"
                color="#3B82F6"
              />
              <SimpleLineChart
                data={mockChartData.churn.data}
                labels={mockChartData.churn.labels}
                title="Churn Rate (%)"
                color="#EF4444"
              />
            </div>
          </CardContent>
        </Card>

        {/* User Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              User Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Free Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{analyticsData.freeUsers.toLocaleString()}</span>
                  <Badge variant="secondary">82.9%</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">Premium Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{analyticsData.premiumUsers.toLocaleString()}</span>
                  <Badge variant="default" className="bg-purple-100 text-purple-800">17.1%</Badge>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Users</span>
                <span className="text-sm font-medium">{(analyticsData.freeUsers + analyticsData.premiumUsers).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg. Revenue per User</span>
                <span className="text-sm font-medium">${analyticsData.avgRevenuePerUser}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium text-green-900">Strong Premium Growth</p>
                <p className="text-sm text-green-700">Premium users increased by 153% in 6 months</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="font-medium text-blue-900">High Conversion Rate</p>
                <p className="text-sm text-blue-700">21.1% conversion rate, above industry average</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="font-medium text-yellow-900">Low Churn Rate</p>
                <p className="text-sm text-yellow-700">1.7% churn rate indicates strong retention</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div>
                <p className="font-medium text-purple-900">Revenue Growth</p>
                <p className="text-sm text-purple-700">15.2% monthly revenue growth trend</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export { SubscriptionAnalyticsContent };
