import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Crown, 
  CreditCard, 
  TrendingUp, 
  DollarSign,
  Calendar,
  Activity,
  BarChart3
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
  }
};

// Simple chart components
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

const MonetizationDashboardContent: React.FC = () => {
  // Mock subscription data
  const subscriptionStats = {
    totalFreeUsers: 1847,
    totalPremiumUsers: 382,
    activeSubscriptions: 356,
    expiredSubscriptions: 26,
    trialSubscriptions: 45,
    monthlyRevenue: 9540,
    conversionRate: 17.2,
    churnRate: 2.1
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-lg">
              <Users className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Free Users</p>
              <p className="text-2xl font-bold text-gray-900">{subscriptionStats.totalFreeUsers.toLocaleString()}</p>
              <p className="text-xs text-green-600">+12% from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Crown className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Premium Users</p>
              <p className="text-2xl font-bold text-gray-900">{subscriptionStats.totalPremiumUsers.toLocaleString()}</p>
              <p className="text-xs text-green-600">+8% from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Subscriptions</p>
              <p className="text-2xl font-bold text-gray-900">{subscriptionStats.activeSubscriptions.toLocaleString()}</p>
              <p className="text-xs text-green-600">+5% from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${subscriptionStats.monthlyRevenue.toLocaleString()}</p>
              <p className="text-xs text-green-600">+15% from last month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Subscription Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Active</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{subscriptionStats.activeSubscriptions}</span>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  {((subscriptionStats.activeSubscriptions / subscriptionStats.totalPremiumUsers) * 100).toFixed(1)}%
                </Badge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">Trial</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{subscriptionStats.trialSubscriptions}</span>
                <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                  {((subscriptionStats.trialSubscriptions / subscriptionStats.totalPremiumUsers) * 100).toFixed(1)}%
                </Badge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm">Expired</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{subscriptionStats.expiredSubscriptions}</span>
                <Badge variant="default" className="bg-red-100 text-red-800">
                  {((subscriptionStats.expiredSubscriptions / subscriptionStats.totalPremiumUsers) * 100).toFixed(1)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Key Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Conversion Rate</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{subscriptionStats.conversionRate}%</span>
                <Badge variant="default" className="bg-green-100 text-green-800">+2.1%</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Churn Rate</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{subscriptionStats.churnRate}%</span>
                <Badge variant="default" className="bg-red-100 text-red-800">+0.3%</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Avg. Revenue per User</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">$25.00</span>
                <Badge variant="default" className="bg-green-100 text-green-800">+$2.50</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New Premium Subscription</p>
                <p className="text-xs text-gray-500">John Doe upgraded to Premium</p>
              </div>
              <span className="text-xs text-gray-400">2h ago</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Trial Started</p>
                <p className="text-xs text-gray-500">Jane Smith started free trial</p>
              </div>
              <span className="text-xs text-gray-400">4h ago</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Subscription Expired</p>
                <p className="text-xs text-gray-500">Mike Johnson's subscription ended</p>
              </div>
              <span className="text-xs text-gray-400">1d ago</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Payment Received</p>
                <p className="text-xs text-gray-500">Monthly payment from Sarah Wilson</p>
              </div>
              <span className="text-xs text-gray-400">1d ago</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Premium vs Free User Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <SimpleLineChart
                data={mockChartData.userGrowth.free}
                labels={mockChartData.userGrowth.labels}
                title="Free Users"
                color="#3B82F6"
              />
              <SimpleLineChart
                data={mockChartData.userGrowth.premium}
                labels={mockChartData.userGrowth.labels}
                title="Premium Users"
                color="#8B5CF6"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Monthly Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleLineChart
              data={mockChartData.revenue.data}
              labels={mockChartData.revenue.labels}
              title="Revenue ($)"
              color="#10B981"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export { MonetizationDashboardContent };
